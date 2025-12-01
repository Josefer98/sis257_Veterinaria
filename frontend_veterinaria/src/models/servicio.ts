import type { TipoServicio } from "./tipo-servicio"


export interface Servicio {
    id: number
    idTipoServicio: number
    nombre: string
    descripcion: string
    precio: number

    tipoServicio: TipoServicio
}