import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, arrowDownCircleOutline, arrowUpCircleOutline } from 'ionicons/icons';

import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/api-response.model';
import { Producto } from '../../models/producto.model';
import { Movimiento } from '../../models/movimiento.model';

/** Respuesta del POST movimientos.php */
interface MovimientoResultado {
  codigo: string;
  stock_anterior: number;
  stock_actual: number;
}

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {
  producto: Producto | null = null;

  /** Valores exactos que espera el backend */
  tipoSeleccionado: Movimiento['tipo'] = 'entrada';
  cantidad: number | null = null;
  cargando = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastController: ToastController,
    private navCtrl: NavController,
  ) {
    addIcons({ arrowBackOutline, arrowDownCircleOutline, arrowUpCircleOutline });
  }

  ngOnInit(): void {
    // El producto llega desde la pantalla del escáner mediante el estado de navegación
    const state =
      (this.router.getCurrentNavigation()?.extras.state as { producto?: Producto } | undefined) ??
      (window.history.state as { producto?: Producto } | undefined);

    if (state?.producto) {
      this.producto = state.producto;
    } else {
      // Entrada directa a /detalle sin producto: volver al escáner
      this.navCtrl.navigateRoot(['/scanner']);
    }
  }

  /** Color según stock: verde > 5, amarillo 1-5, rojo 0 */
  getBadgeColor(): string {
    const stock = this.producto?.stock ?? 0;
    if (stock > 5) {
      return 'success';
    }
    return stock > 0 ? 'warning' : 'danger';
  }

  /** Entero estrictamente mayor que 0 */
  esCantidadValida(): boolean {
    return this.cantidad !== null && Number.isInteger(this.cantidad) && this.cantidad > 0;
  }

  async confirmarMovimiento(): Promise<void> {
    if (!this.producto || this.cargando) {
      return;
    }

    if (!this.esCantidadValida()) {
      await this.mostrarToast('Ingresa una cantidad entera mayor a 0', 'warning');
      return;
    }

    this.cargando = true;

    try {
      const res = await this.apiService.postJson<ApiResponse<MovimientoResultado>>('movimientos.php', {
        codigo: this.producto.codigo,
        tipo: this.tipoSeleccionado,
        cantidad: this.cantidad,
      });

      if (res?.success && res.data) {
        this.producto = { ...this.producto, stock: res.data.stock_actual };
        this.cantidad = null;
        await this.mostrarToast('Movimiento registrado con éxito', 'success');
      } else {
        await this.mostrarToast(res?.error || 'No se pudo registrar el movimiento', 'danger');
      }
    } catch (error) {
      // Ej.: "POST .../movimientos.php | HTTP 400 | Stock insuficiente". Se conserva la cantidad para corregirla.
      await this.mostrarToast(this.apiService.explainError(error), 'danger');
    } finally {
      this.cargando = false;
    }
  }

  volverAlEscaner(): void {
    this.navCtrl.navigateBack(['/scanner']);
  }

  irAlHistorial(): void {
    this.navCtrl.navigateForward(['/historial']);
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
