import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsDefined,
  IsNotEmpty,
  isNotEmpty,
  IsNumber,
  IsString,
  isString,
  MaxLength,
} from 'class-validator';

export class CreateServicioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo no debe estar vacio' })
  @IsString({ message: 'El campo  nombre debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El campo nombre no debe exceder los 100 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo no debe estar vacio' })
  @IsString({ message: 'El campo  descripcion debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El campo descripcion no debe exceder los 100 caracteres',
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
}
