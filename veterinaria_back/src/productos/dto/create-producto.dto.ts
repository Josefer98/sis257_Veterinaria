import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre no debe estar vacío' })
  @IsString({ message: 'El campo nombre debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El campo nombre no debe exceder los 100 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripción no debe estar vacío' })
  @IsString({ message: 'El campo descripción debe ser una cadena de texto' })
  @MaxLength(555, {
    message: 'El campo descripción no debe exceder los 555 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly descripcion: string;

  @ApiProperty()
  @IsDefined({ message: 'El precio debe estar definido' })
  @Transform(({ value }) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) throw new Error('El precio debe ser un numero decimal');
    return num;
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'El precio debe ser un numero decimal con maximo dos decimales',
    },
  )
  readonly precio: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo stock no debe estar vacío' })
  @IsInt({ message: 'El campo stock debe ser un número entero' })
  readonly stock: number;

  @ApiProperty({ required: false })
  @IsString({ message: 'La URL de la imagen debe ser texto' })
  @MaxLength(500, { message: 'La URL de la imagen es muy larga' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly imagenUrl?: string;
}
