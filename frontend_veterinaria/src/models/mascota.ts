import type { Cliente } from './cliente'

export interface Mascota {
  id: number
  idCliente: number
  nombre: string
  especie: string
  raza: string
  edad: number

  clientes: Cliente
}
