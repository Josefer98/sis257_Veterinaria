import type { Cliente } from './cliente'

export interface Venta {
  id: number
  idCliente: number
  fecha: Date
  total: number

  cliente: Cliente
}
