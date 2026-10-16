import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, pulseOutline, saveOutline, warningOutline } from 'ionicons/icons';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: false,
})
export class ConfiguracionPage implements OnInit {
  baseUrl = '';
  connectionSuccess: boolean | null = null;
  statusMessage = '';
  phpVersion = '';
  mysqlStatus = '';

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {
    addIcons({ checkmarkCircleOutline, closeCircleOutline, pulseOutline, saveOutline, warningOutline });
  }

  ngOnInit(): void {
    this.baseUrl = this.apiService.getBaseUrl();
  }

  /** La app corre en el celular: localhost apuntaría al propio teléfono. */
  private esUrlLocal(url: string): boolean {
    return /\/\/(localhost|127\.0\.0\.1)([:/]|$)/i.test(url);
  }

  /** Prueba health.php con la URL escrita, sin guardarla todavía. */
  async testConnection(): Promise<void> {
    const url = this.apiService.normalizeUrl(this.baseUrl);

    if (!url) {
      await this.presentToast('Ingresa una URL válida.', 'warning');
      return;
    }
    if (this.esUrlLocal(url)) {
      await this.presentToast('No uses localhost ni 127.0.0.1: usa la IP de la laptop.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Probando conexión...', spinner: 'crescent' });
    await loading.present();
    this.connectionSuccess = null;

    try {
      const res = await this.apiService.checkHealth(url);
      await loading.dismiss();

      if (res?.success) {
        this.connectionSuccess = true;
        this.phpVersion = res.data?.php ?? 'Desconocida';
        this.mysqlStatus = res.data?.mysql ?? 'ok';
        this.statusMessage = 'Conexión exitosa con el servidor.';
        await this.presentToast('Conexión establecida correctamente', 'success');
      } else {
        this.mostrarFallo(res?.error || 'El servidor respondió pero no está operativo.');
      }
    } catch (error) {
      await loading.dismiss();
      // Incluye HTTP 503 cuando MySQL está caído, o falta de respuesta si Apache está apagado
      this.mostrarFallo(this.apiService.explainError(error));
    }
  }

  private mostrarFallo(mensaje: string): void {
    this.connectionSuccess = false;
    this.statusMessage = mensaje;
    this.presentToast('Error al conectar con el servidor', 'danger');
  }

  async saveConfig(): Promise<void> {
    const url = this.apiService.normalizeUrl(this.baseUrl);

    if (!url) {
      await this.presentToast('Ingresa una URL antes de guardar.', 'warning');
      return;
    }
    if (this.esUrlLocal(url)) {
      await this.presentToast('No uses localhost ni 127.0.0.1: usa la IP de la laptop.', 'warning');
      return;
    }

    this.apiService.setBaseUrl(url);
    await this.presentToast('Configuración guardada con éxito.', 'success');
    this.navCtrl.navigateRoot(['/scanner']);
  }

  private async presentToast(message: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 3500, color, position: 'bottom' });
    await toast.present();
  }
}
