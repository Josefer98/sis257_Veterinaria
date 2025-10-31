import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateClienteDto {
    
    @ApiProperty()
    @IsNotEmpty({ message: 'El campo nombres no debe estar vacío' })
    @IsString({ message: 'El campo nombres debe ser una cadena de texto' })
    @MaxLength(100, { message: 'El campo nombres no debe exceder los 100 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly nombres: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo apellidos no debe estar vacío' })
    @IsString({ message: 'El campo apellidos debe ser una cadena de texto' })
    @MaxLength(100, { message: 'El campo apellidos no debe exceder los 100 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly apellidos: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo teléfono no debe estar vacío' })
    @IsString({ message: 'El campo teléfono debe ser una cadena de texto' })
    @MaxLength(15, { message: 'El campo teléfono no debe exceder los 15 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly telefono: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo nombre de la mascota no debe estar vacío' })
    @IsString({ message: 'El campo nombre de la mascota debe ser una cadena de texto' })
    @MaxLength(50, { message: 'El campo nombre de la mascota no debe exceder los 50 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly nombreMascota: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo tipo de mascota no debe estar vacío' })
    @IsString({ message: 'El campo tipo de mascota debe ser una cadena de texto' })
    @MaxLength(50, { message: 'El campo tipo de mascota no debe exceder los 50 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly tipoMascota: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo raza no debe estar vacío' })
    @IsString({ message: 'El campo raza debe ser una cadena de texto' })
    @MaxLength(50, { message: 'El campo raza no debe exceder los 50 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly raza: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo edad de la mascota no debe estar vacío' })
    @IsInt({ message: 'El campo edad de la mascota debe ser un número entero' })
    readonly edadMascota: number;
}
