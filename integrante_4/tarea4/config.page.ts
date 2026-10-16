import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service'; // Ajusta la ruta a tu ApiService

interface HealthCheckResponse {
  status: string;
  php_version?: string;
  mysql_status?: string;
  message?: string;
}

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  baseUrl: string = '';
  connectionSuccess: boolean | null = null;
  statusMessage: string = '';
  phpVersion: string = '';
  mysqlStatus: string = '';

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Carga la URL previa guardada en el ApiService si existe
    this.baseUrl = this.apiService.getBaseUrl() || 'http://192.168.1.75/inventarioqr/api';
  }

  /**
   * Limpia la URL removiendo diagonales al final para estandarizar
   */
  private sanitizeUrl(url: string): string {
    return url.trim().replace(/\/+$/, '');
  }

  /**
   * Prueba la conexión haciendo un GET al endpoint health.php
   */
  async testConnection() {
    if (!this.baseUrl) {
      this.presentToast('Por favor, ingresa una URL válida.', 'warning');
      return;
    }

    const cleanUrl = this.sanitizeUrl(this.baseUrl);
    const healthEndpoint = `${cleanUrl}/health.php`;

    const loading = await this.loadingCtrl.create({
      message: 'Probando conexión...',
      spinner: 'crescent'
    });
    await loading.present();

    this.connectionSuccess = null;

    this.http.get<HealthCheckResponse>(healthEndpoint, { observe: 'response' }).subscribe({
      next: (response) => {
        loading.dismiss();
        if (response.status === 200 && response.body?.status === 'ok') {
          this.connectionSuccess = true;
          this.phpVersion = response.body.php_version || 'Desconocida';
          this.mysqlStatus = response.body.mysql_status || 'Conectado';
          this.statusMessage = 'Conexión exitosa con el servidor.';
          this.presentToast('Conexión establecida correctamente', 'success');
        } else {
          this.handleErrorResponse();
        }
      },
      error: (err) => {
        loading.dismiss();
        this.handleErrorResponse(err);
      }
    });
  }

  private handleErrorResponse(err?: any) {
    this.connectionSuccess = false;
    this.statusMessage = 'El servidor no responde o MySQL está caído. Verifica la IP y que XAMPP/WAMP esté activo.';
    this.presentToast('Error al conectar con el servidor', 'danger');
  }

  /**
   * Guarda la URL en el ApiService y redirige al inicio
   */
  async saveConfig() {
    if (!this.baseUrl) {
      this.presentToast('Ingresa una URL antes de guardar.', 'warning');
      return;
    }

    const cleanUrl = this.sanitizeUrl(this.baseUrl);
    this.apiService.setBaseUrl(cleanUrl);

    const toast = await this.toastCtrl.create({
      message: 'Configuración guardada con éxito.',
      duration: 1500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    // Redirige a la página inicial (ajusta la ruta según tu app)
    this.router.navigate(['/home']);
  }

  private async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}