export interface Movimiento {
  id?: number;
  producto_id?: number;
  /** Nombre del producto para visualización en historial. */
  producto?: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  stock_antes?: number;
  stock_despues?: number;
  creado_en?: string;
}