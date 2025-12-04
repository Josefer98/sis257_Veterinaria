import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class DetalleVentasService {
  constructor(
    @InjectRepository(DetalleVenta)
    private detalleventasRepository: Repository<DetalleVenta>,
  ) {}

  async create(
    createDetalleVentaDto: CreateDetalleVentaDto,
  ): Promise<DetalleVenta> {
    const detalleventa = this.detalleventasRepository.create(
      createDetalleVentaDto,
    );
    return this.detalleventasRepository.save(detalleventa);
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.detalleventasRepository.find({
      relations: { producto: true, servicio: true },
      select: {
        id: true,
        tipoItem: true,
        cantidad: true,
        idVenta: true,
        producto: { id: true, nombre: true, precio: true },
        servicio: { id: true, nombre: true, precio: true },
      },
      order: { id: 'DESC' },
    });
  }

  async findByVenta(idVenta: number): Promise<DetalleVenta[]> {
    return this.detalleventasRepository.find({
      where: { idVenta },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<DetalleVenta> {
    const detalleventa = await this.detalleventasRepository.findOne({
      where: { id },
    });
    if (!detalleventa)
      throw new NotFoundException('detallede  venta no encontrado');

    return detalleventa;
  }

  update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto) {
    return `This action updates a #${id} detalleVenta`;
  }

  async remove(id: number): Promise<DetalleVenta> {
    const detalleventa = await this.findOne(id);
    return this.detalleventasRepository.softRemove(detalleventa);
  }
}
