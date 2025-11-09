import { PartialType } from '@nestjs/swagger';
import { CreateFacturaserivicioDto } from './create-facturaserivicio.dto';

export class UpdateFacturaserivicioDto extends PartialType(CreateFacturaserivicioDto) {}
