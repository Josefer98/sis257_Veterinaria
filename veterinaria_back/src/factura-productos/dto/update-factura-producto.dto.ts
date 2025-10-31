import { PartialType } from '@nestjs/swagger';
import { CreateFacturaProductoDto } from './create-factura-producto.dto';

export class UpdateFacturaProductoDto extends PartialType(CreateFacturaProductoDto) {}
