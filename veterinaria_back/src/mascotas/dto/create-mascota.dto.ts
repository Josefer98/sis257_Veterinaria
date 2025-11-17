import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMascotaDto {
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
  @IsNotEmpty({ message: 'El campo especie no debe estar vacío' })
  @IsString({ message: 'El campo especie debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El campo especie no debe exceder los 100 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly especie: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo raza no debe estar vacío' })
  @IsString({ message: 'El campo raza debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El campo raza no debe exceder los 100 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly raza: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo edad no debe estar vacío' })
  @IsInt({ message: 'El campo edad debe ser un número entero' })
  readonly edad: number;
}
