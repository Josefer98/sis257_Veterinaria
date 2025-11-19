import type { Producto } from "./producto"
import type { Servicio } from "./servicio"
import type { Venta } from "./venta"

export interface DetalleVenta {
  id: number
  idVenta: number
  tipoItem: 'producto' | 'servicio'
  idServicio:number | null
  idProducto:number | null
  cantidad: number
  precioUnitario: number
  subtotal: number

  venta:Venta
  producto:Producto
  servicio: Servicio
}