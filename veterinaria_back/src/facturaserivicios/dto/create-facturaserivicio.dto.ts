import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsDefined, IsInt } from "class-validator";


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
    @IsDefined({ message: 'El campo total debe estar definido' })
    @IsDecimal({}, { message: 'El campo total debe ser numérico' })
    total: number;

}
