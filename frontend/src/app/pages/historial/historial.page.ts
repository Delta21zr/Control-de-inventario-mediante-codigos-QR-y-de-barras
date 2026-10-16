import { Component } from '@angular/core';
import { RefresherCustomEvent, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowDownCircleOutline, arrowUpCircleOutline, refreshOutline } from 'ionicons/icons';

import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/api-response.model';
import { Movimiento } from '../../models/movimiento.model';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false,
})
export class HistorialPage implements ViewWillEnter {
  movimientos: Movimiento[] = [];
  cargando = false;
  error = '';

  constructor(private apiService: ApiService) {
    addIcons({ arrowDownCircleOutline, arrowUpCircleOutline, refreshOutline });
  }

  /** Recarga cada vez que se entra a la pantalla (refleja los movimientos recién guardados). */
  ionViewWillEnter(): void {
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      const res = await this.apiService.get<ApiResponse<Movimiento[]>>('movimientos.php');
      this.movimientos = res?.success && res.data ? res.data : [];
      if (!res?.success) {
        this.error = res?.error || 'No se pudo cargar el historial.';
      }
    } catch (error) {
      this.movimientos = [];
      this.error = this.apiService.explainError(error);
    } finally {
      this.cargando = false;
    }
  }

  async refrescar(event: RefresherCustomEvent): Promise<void> {
    await this.cargar();
    event.target.complete();
  }

  /** MySQL entrega "YYYY-MM-DD HH:MM:SS"; se muestra tal cual en formato legible. */
  formatearFecha(fecha?: string): string {
    return fecha ? fecha.replace('T', ' ').substring(0, 16) : '';
  }
}
