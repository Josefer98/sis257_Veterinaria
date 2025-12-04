import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateVenteItemDto {
  @ApiProperty({ enum: ['producto', 'servicio'] })
  @IsNotEmpty({ message: 'El campo tipo no debe estar vacío' })
  readonly tipoItem: 'producto' | 'servicio';

  @ApiProperty({ required: false })
  readonly idProducto?: number;

  @ApiProperty({ required: false })
  readonly idServicio?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cantidad no debe estar vacío' })
  @IsInt({ message: 'El campo cantidad debe ser un número entero' })
  readonly cantidad: number;
}
export class CreateVentaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idCliente no debe estar vacío' })
  @IsInt({ message: 'El campo idCliente debe ser un número entero' })
  readonly idCliente: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'El campo idMascota debe ser un número entero' })
  readonly idMascota?: number;

  @ApiProperty({ type: [CreateVenteItemDto] })
  @IsArray({ message: 'El campo items debe ser un arreglo' })
  @Type(() => CreateVenteItemDto)
  readonly items: CreateVenteItemDto[];
}
