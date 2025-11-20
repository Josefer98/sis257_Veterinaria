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

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idServicio no debe estar vacío'})
  @IsInt({ message: 'El campo idServicio debe ser un número entero'})
  readonly idServicio?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idProducto no debe estar vacío'})
  @IsInt({ message: 'El campo idProducto debe ser un número entero'})
  readonly idProducto?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cantidad no debe estar vacío'})
  @IsInt({ message: 'El campo cantidad debe ser un número entero'})
  readonly cantidad: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precioUnitario no debe estar vacío'})
  @IsInt({ message: 'El campo precioUnitario debe ser un número entero'})
  readonly precioUnitario: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo subtotal no debe estar vacío'})
  @IsInt({ message: 'El campo subtotal debe ser un número entero'})
  readonly subtotal: number;
}
