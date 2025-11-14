import type { Producto } from "./producto";
import type { Venta } from "./venta";

export interface FacturaProducto {
  id: number;
  idVenta: number;
  idProducto: number;
  cantidad: number;
  total: number;

  venta: Venta;
  producto: Producto;
}