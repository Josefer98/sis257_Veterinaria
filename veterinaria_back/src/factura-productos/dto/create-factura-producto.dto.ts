import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsDefined, IsInt } from 'class-validator';

export class CreateFacturaProductoDto {
  idVenta: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo id del producto debe estar definido' })
  @IsInt({ message: 'El campo id del producto debe ser numérico' })
  idProducto: number;
  
  @ApiProperty()
    @IsDefined({ message: 'El campo cantidad debe estar definido' })
    @IsInt({ message: 'El campo cantidad debe ser numérico' })
  cantidad: number;

    @ApiProperty()
    @IsDefined({ message: 'El campo total debe estar definido' })
    @IsDecimal({}, { message: 'El campo total debe ser un número decimal' })
  total: number;
}
