import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDecimal, IsNotEmpty, isNotEmpty, IsString, isString, MaxLength } from "class-validator";

export class CreateServicioDto {


    @ApiProperty()
    @IsNotEmpty({ message: 'El campo no debe estar vacio' })
    @IsString({ message: 'El campo  nombre debe ser una cadena de texto' })
    @MaxLength(100, { message: 'El campo nombre no debe exceder los 100 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly nombre: string;


    @ApiProperty()
    @IsNotEmpty({ message: 'El campo no debe estar vacio' })
    @IsString({ message: 'El campo  descripcion debe ser una cadena de texto' })
    @MaxLength(100, { message: 'El campo descripcion no debe exceder los 100 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly descripcion: string;

    

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo no debe estar vacio' })
    @IsString({ message: 'El campo  de tipo de servicio debe ser una cadena de texto' })
    @MaxLength(100, { message: 'El campo de tipo de servicio no debe exceder los 100 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly tipoServicio: string;


    @ApiProperty()
    @IsNotEmpty({ message: 'El campo precio no debe estar vacío' })
    @IsDecimal({}, { message: 'El campo precio debe ser un número decimal' })
    readonly precio: number;


}
