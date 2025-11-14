import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDecimal, IsDefined, IsInt, IsNumber } from 'class-validator';

export class CreateFacturaserivicioDto {
  @ApiProperty()
  @IsDefined({ message: 'El campo id de la venta debe estar definido' })
  @IsInt({ message: 'El campo id de la venta debe ser numérico' })
  idVenta: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo id del servicio debe estar definido' })
  @IsInt({ message: 'El campo id del servicio debe ser numérico' })
  idServicio: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo cantidad debe estar definido' })
  @IsInt({ message: 'El campo cantidad debe ser numérico' })
  cantidad: number;

  @ApiProperty()
  @IsDefined({ message: 'El total debe estar definido' })
  @Transform(({ value }) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) throw new Error('El total debe ser un numero decimal');
    return num;
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'El total debe ser un numero decimal con maximo dos decimales',
    },
  )
  total: number;
}
