import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateDetalleVentaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idVenta no debe estar vacío' })
  @IsInt({ message: 'El campo idVenta debe ser un número entero' })
  readonly idVenta: number;

  @ApiProperty({ enum: ['producto', 'servicio'] })
  @IsNotEmpty({ message: 'El campo tipoItem no debe estar vacío' })
  readonly tipoItem: string;
  readonly idServicio?: number;
  readonly idProducto?: number;
  readonly cantidad: number;
  readonly precioUnitario: number;
  readonly subtotal: number;
}
