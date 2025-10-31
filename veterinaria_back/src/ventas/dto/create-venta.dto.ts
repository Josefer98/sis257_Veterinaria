import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsDefined, IsInt, IsNotEmpty } from "class-validator";

export class CreateVentaDto {
    
    @ApiProperty()
    @IsNotEmpty({ message: 'El campo idCliente no debe estar vacío' })
    @IsInt({ message: 'El campo idCliente debe ser un número entero' })
    readonly idCliente: number;
    
    @ApiProperty()
    @IsDefined({ message: 'El campo fecha no debe estar vacío' })
    @IsDateString({}, { message: 'El campo fecha debe ser una fecha válida' })
    readonly fecha: Date;
    
    @ApiProperty()
    @IsNotEmpty({ message: 'El campo total no debe estar vacío' })
    @IsInt({ message: 'El campo total debe ser un número entero' })
    readonly total: number;
}
