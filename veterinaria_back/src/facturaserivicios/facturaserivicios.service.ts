import { Injectable } from '@nestjs/common';
import { CreateFacturaserivicioDto } from './dto/create-facturaserivicio.dto';
import { UpdateFacturaserivicioDto } from './dto/update-facturaserivicio.dto';

@Injectable()
export class FacturaseriviciosService {
  create(createFacturaserivicioDto: CreateFacturaserivicioDto) {
    return 'This action adds a new facturaserivicio';
  }

  findAll() {
    return `This action returns all facturaserivicios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} facturaserivicio`;
  }

  update(id: number, updateFacturaserivicioDto: UpdateFacturaserivicioDto) {
    return `This action updates a #${id} facturaserivicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} facturaserivicio`;
  }
}
