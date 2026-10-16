import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastController, NavController } from '@ionic/angular';

interface Producto {
  codigo: string;
  nombre: string;
  stock_actual: number;
}

interface MovimientoResponse {
  exito: boolean;
  mensaje: string;
  stock_actual: number;
}

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  // Datos del producto (pueden ser recibidos por Router/NavParams)
  producto: Producto = {
    codigo: 'PROD-001',
    nombre: 'Producto de Ejemplo',
    stock_actual: 10
  };

  tipoSeleccionado: 'Entrada' | 'Salida' = 'Entrada';
  cantidad: number | null = null;
  cargando: boolean = false;

  private apiUrl = 'https://tu-servidor.com/api/movimientos.php';

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // Si pasas el producto desde la página anterior usando la navegación de Ionic
    // const state = window.history.state;
    // if (state && state.producto) {
    //   this.producto = state.producto;
    // }
  }

  // Color dinámico según el stock actual
  getBadgeColor(): string {
    if (this.producto.stock_actual > 5) {
      return 'success'; // Verde
    } else if (this.producto.stock_actual > 0) {
      return 'warning'; // Amarillo
    } else {
      return 'danger';  // Rojo
    }
  }

  // Validación de la cantidad (entero strictly mayor a 0)
  esCantidadValida(): boolean {
    return (
      this.cantidad !== null &&
      this.cantidad !== undefined &&
      Number.isInteger(this.cantidad) &&
      this.cantidad > 0
    );
  }

  confirmarMovimiento() {
    if (!this.esCantidadValida()) {
      this.mostrarToast('Ingresa una cantidad entera válida mayor a 0', 'warning');
      return;
    }

    this.cargando = true;

    const payload = {
      codigo: this.producto.codigo,
      tipo: this.tipoSeleccionado,
      cantidad: this.cantidad
    };

    this.http.post<MovimientoResponse>(this.apiUrl, payload).subscribe({
      next: (response) => {
        this.cargando = false;
        
        // Actualizar el stock con la respuesta del servidor
        if (response && response.stock_actual !== undefined) {
          this.producto.stock_actual = response.stock_actual;
        }

        this.mostrarToast('Movimiento registrado con éxito', 'success');
        this.cantidad = null; // Limpiar formulario
      },
      error: (error: HttpErrorResponse) => {
        this.cargando = false;
        
        // Extraer mensaje exacto del servidor en error HTTP 400 u otro
        let mensajeError = 'Ocurrió un error al procesar la solicitud.';
        if (error.error && error.error.mensaje) {
          mensajeError = error.error.mensaje;
        } else if (typeof error.error === 'string') {
          mensajeError = error.error;
        }

        this.mostrarToast(mensajeError, 'danger');
        // Los datos se mantienen en this.cantidad para que el operador corrija
      }
    });
  }

  volverAlEscaner() {
    this.navCtrl.back();
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}