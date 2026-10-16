import { Component, OnDestroy } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { addIcons } from 'ionicons';
import { qrCodeOutline, settingsOutline, timeOutline, informationCircleOutline } from 'ionicons/icons';

import { ScannerService } from '../../core/services/scanner.service';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/api-response.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
  standalone: false,
})
export class ScannerPage implements OnDestroy {
  constructor(
    private scannerService: ScannerService,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
  ) {
    addIcons({ qrCodeOutline, settingsOutline, timeOutline, informationCircleOutline });
  }

  ngOnDestroy(): void {
    // Libera la espera del escáner si el usuario navega fuera
    this.scannerService.stopScan();
  }

  async onStartScan(): Promise<void> {
    const codigo = await this.scannerService.startScan();

    // Cancelación, permiso denegado o lectura vacía: no se llama a la API
    if (!codigo) {
      if (this.scannerService.lastError) {
        await this.mostrarToast(this.scannerService.lastError, 'warning');
      }
      return;
    }

    await this.consultarProducto(codigo);
  }

  private async consultarProducto(codigo: string): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Consultando producto...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const res = await this.apiService.get<ApiResponse<Producto>>(
        `productos.php?codigo=${encodeURIComponent(codigo)}`,
      );
      await loading.dismiss();

      if (res?.success && res.data) {
        const extras: NavigationExtras = { state: { producto: res.data } };
        await this.navCtrl.navigateForward(['/detalle'], extras);
      } else {
        await this.mostrarToast(res?.error || 'No se encontró la información del producto.', 'danger');
      }
    } catch (error) {
      await loading.dismiss();
      await this.mostrarToast(this.apiService.explainError(error), 'danger');
    }
  }

  private async mostrarToast(mensaje: string, color: 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 4500,
      color,
      position: 'bottom',
      buttons: [{ text: 'OK', role: 'cancel' }],
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
