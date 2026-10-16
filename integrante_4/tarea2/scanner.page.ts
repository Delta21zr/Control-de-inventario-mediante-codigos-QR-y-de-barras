import { Component, OnDestroy } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

// Reemplaza estas rutas según la estructura de carpetas de tu proyecto
import { ScannerService } from 'src/app/services/scanner.service';
import { ApiService, ApiResponse } from 'src/app/services/api.service';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnDestroy {

  constructor(
    private scannerService: ScannerService,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnDestroy(): void {
    // Asegurar que se detenga la cámara o recursos del escáner si el usuario navega fuera
    this.scannerService.stopScan();
  }

  async onStartScan(): Promise<void> {
    try {
      const codigo = await this.scannerService.startScan();

      if (!codigo || codigo === 'CANCELLED') {
        return;
      }

      await this.consultarProducto(codigo);
    } catch (error) {
      const mensajeError = this.apiService.explainError(error);
      await this.mostrarToastError(mensajeError);
    }
  }

  private async consultarProducto(codigo: string): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Consultando producto...',
      spinner: 'crescent'
    });
    await loading.present();

    const endpoint = `productos.php?codigo=${encodeURIComponent(codigo)}`;

    this.apiService.get<ApiResponse<Producto>>(endpoint).subscribe({
      next: async (res) => {
        await loading.dismiss();

        if (res && res.data) {
          const navigationExtras: NavigationExtras = {
            state: { producto: res.data }
          };
          this.navCtrl.navigateForward(['/detalle'], navigationExtras);
        } else {
          const mensaje = res?.message || 'No se encontró la información del producto.';
          await this.mostrarToastError(mensaje);
        }
      },
      error: async (err) => {
        await loading.dismiss();
        const mensajeError = this.apiService.explainError(err);
        await this.mostrarToastError(mensajeError);
      }
    });
  }

  private async mostrarToastError(mensaje: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3500,
      color: 'danger',
      position: 'bottom',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  irAConfiguracion(): void {
    this.navCtrl.navigateForward(['/configuracion']);
  }

  irAHistorial(): void {
    this.navCtrl.navigateForward(['/historial']);
  }
}