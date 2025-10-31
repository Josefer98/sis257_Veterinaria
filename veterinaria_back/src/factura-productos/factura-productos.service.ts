import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFacturaProductoDto } from './dto/create-factura-producto.dto';
import { UpdateFacturaProductoDto } from './dto/update-factura-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FacturaProducto } from './entities/factura-producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FacturaProductosService {
  constructor(
    @InjectRepository(FacturaProducto)
    private facturaProductosRepository: Repository<FacturaProducto>,
  ) {}

  async create(
    createFacturaProductoDto: CreateFacturaProductoDto,
  ): Promise<FacturaProducto> {
    let facturaProducto = await this.facturaProductosRepository.findOneBy({
      idProducto: createFacturaProductoDto.idProducto,
    });
    if (facturaProducto)
      throw new ConflictException('El producto ya existe en la factura');

    facturaProducto = new FacturaProducto();
    Object.assign(facturaProducto, createFacturaProductoDto);
    return this.facturaProductosRepository.save(facturaProducto);
  }

  async findAll(): Promise<FacturaProducto[]> {
    return this.facturaProductosRepository.find({
      relations: { producto: true },
      select: {
        id: true,
        cantidad: true,
        total: true,
        producto: { id: true },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<FacturaProducto> {
    const facturaProducto = await this.facturaProductosRepository.findOne({
      where: { id },
      relations: { producto: true },
    });
    if (!facturaProducto)
      throw new NotFoundException('FacturaProducto no encontrado');
    return facturaProducto;
  }

  async update(
    id: number,
    updateFacturaProductoDto: UpdateFacturaProductoDto,
  ): Promise<FacturaProducto> {
    const facturaProducto = await this.facturaProductosRepository.findOneBy({
      id,
    });
    if (!facturaProducto)
      throw new NotFoundException('FacturaProducto no encontrado');

    Object.assign(facturaProducto, updateFacturaProductoDto);
    return this.facturaProductosRepository.save(facturaProducto);
  }

  async remove(id: number): Promise<FacturaProducto> {
    const facturaProducto = await this.findOne(id);
    return this.facturaProductosRepository.softRemove(facturaProducto);
  }
}
