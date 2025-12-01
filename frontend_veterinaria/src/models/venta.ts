import type { Cliente } from './cliente'
import type { Mascota } from './mascota'

export interface Venta {
  id: number
  idCliente: number
  idMascota?: number
  fecha: Date
  total: number

  cliente: Cliente
  mascota?: Mascota
}

