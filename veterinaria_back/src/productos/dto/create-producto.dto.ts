import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDecimal, IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateProductoDto {
     
    @ApiProperty()
    @IsNotEmpty({ message: 'El campo nombre no debe estar vacío' })
    @IsString({ message: 'El campo nombre debe ser una cadena de texto' })
    @MaxLength(100, { message: 'El campo nombre no debe exceder los 100 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly nombre: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo categoría no debe estar vacío' })
    @IsString({ message: 'El campo categoría debe ser una cadena de texto' })
    @MaxLength(100, { message: 'El campo categoría no debe exceder los 100 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly categoria: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo descripción no debe estar vacío' })
    @IsString({ message: 'El campo descripción debe ser una cadena de texto' })
    @MaxLength(555, { message: 'El campo descripción no debe exceder los 555 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly descripcion: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo precio no debe estar vacío' })
    @IsDecimal({}, { message: 'El campo precio debe ser un número decimal' })
    readonly precio: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo stock no debe estar vacío' })
    @IsInt({ message: 'El campo stock debe ser un número entero' })
    readonly stock: number;
}
