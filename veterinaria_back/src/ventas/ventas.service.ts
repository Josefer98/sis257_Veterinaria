import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentasService {
  constructor(@InjectRepository(Venta) private ventasRepository: Repository<Venta>) {}
  
  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    let venta = await this.ventasRepository.findOneBy({
      idCliente: createVentaDto.idCliente,
      fecha: createVentaDto.fecha,
    });
    if (venta) throw new ConflictException('La venta ya existe');

    venta = new Venta();
    Object.assign(venta, createVentaDto);
    return this.ventasRepository.save(venta);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({
      relations: { cliente: true },
      select: {
        id: true,
        fecha: true,
        total: true,
        cliente: { id: true, nombres: true, nombreMascota: true },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: { cliente: true },
  });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne( id );
    Object.assign(venta, updateVentaDto);
    return this.ventasRepository.save(venta);
  }

  async remove(id: number): Promise<Venta> {
    const venta = await this.findOne(id);
    return this.ventasRepository.softRemove(venta);
  }
}
