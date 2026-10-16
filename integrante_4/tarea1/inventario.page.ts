import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

interface Movimiento {
  id: number;
  producto: string;
  cantidad: number;
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  movimientos: Movimiento[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarMovimientos();
  }

  async cargarMovimientos() {
    try {
      this.movimientos = await this.apiService.get<Movimiento[]>('/movimientos.php');
    } catch (error) {
      const mensajeError = this.apiService.explainError(error);
      console.error(mensajeError);
    }
  }

  async registrarMovimiento() {
    try {
      const payload = { producto_id: 10, cantidad: 5 };
      const respuesta = await this.apiService.postJson<{ success: boolean }>('/movimientos.php', payload);
      console.log('Registrado con éxito', respuesta);
    } catch (error) {
      const mensajeError = this.apiService.explainError(error);
      alert(mensajeError); // Muestra p.ej: "HTTP 400 | /movimientos.php | Stock insuficiente"
    }
  }
}