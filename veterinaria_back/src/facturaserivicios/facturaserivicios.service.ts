import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacturaserivicioDto } from './dto/create-facturaserivicio.dto';
import { UpdateFacturaserivicioDto } from './dto/update-facturaserivicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Facturaserivicio } from './entities/facturaserivicio.entity';
import { Repository } from 'typeorm';


@Injectable()

export class FacturaseriviciosService {
  constructor(
    @InjectRepository(Facturaserivicio)
    private facturaseriviciosRepository: Repository<Facturaserivicio>,
  ) { }
  async create(
    createFacturaserivicioDto: CreateFacturaserivicioDto): Promise<Facturaserivicio> {
    let facturaserivicio = await this.facturaseriviciosRepository.findOneBy({
      idServicio: createFacturaserivicioDto.idServicio,
      idVenta: createFacturaserivicioDto.idVenta,
    });
    if (facturaserivicio)
      throw new ConflictException('El servicio ya existe en la factura');
    facturaserivicio = new Facturaserivicio();
    Object.assign(facturaserivicio, createFacturaserivicioDto);
    return this.facturaseriviciosRepository.save(facturaserivicio);
  }



  async findAll(): Promise<Facturaserivicio[]> {
    return this.facturaseriviciosRepository.find({
      relations: { servicio: true, venta: true },
      select: {
        id: true,
        cantidad: true,
        total: true,
        servicio: { id: true },
        venta: { id: true },
      },
      order: { id: 'ASC' },
    });
  }



  async findOne(id: number): Promise<Facturaserivicio> {
    const facturaserivicio = await this.facturaseriviciosRepository.findOne({
      where: { id },
      relations: { servicio: true, venta: true },
    });
    if (!facturaserivicio)
      throw new ConflictException('Facturaserivicio no encontrado');
    return facturaserivicio;
  }

  async update(id: number, updateFacturaserivicioDto: UpdateFacturaserivicioDto): Promise<Facturaserivicio> {
    const facturaserivicio = await this.facturaseriviciosRepository.findOneBy({
      id,
    });
    if (!facturaserivicio)
      throw new NotFoundException('Facturaserivicio no encontrado');
    Object.assign(facturaserivicio, updateFacturaserivicioDto);
    return this.facturaseriviciosRepository.save(facturaserivicio);
  }

  async remove(id: number): Promise<Facturaserivicio> {
    const facturaserivicio = await this.findOne(id);
    return this.facturaseriviciosRepository.softRemove(facturaserivicio);
  }
}