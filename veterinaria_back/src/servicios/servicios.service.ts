import { ConflictException, Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { Repository } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private serviciosRepository: Repository<Servicio>,
  ) {}

  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    let servicio = await this.serviciosRepository.findOneBy({
      nombre: createServicioDto.nombre.trim(),
    });
    if (servicio) throw new ConflictException('El servicio ya está registrado');

    servicio = new Servicio();
    Object.assign(servicio, createServicioDto);
    return this.serviciosRepository.save(servicio);
  }

  async findAll(): Promise<Servicio[]> {
    return this.serviciosRepository.find({
      relations: { tipoServicio: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        tipoServicio: { id: true, nombre: true },
      },
    });
  }

  async findOne(id: number): Promise<Servicio> {
    const servicio = await this.serviciosRepository.findOneBy({ id });
    if (!servicio) throw new ConflictException('Servicio no encontrado');
    return servicio;
  }

  async update(
    id: number,
    UpdateServicioDto: UpdateServicioDto,
  ): Promise<Servicio> {
    const producto = await this.findOne(id);
    Object.assign(producto, UpdateServicioDto);
    return this.serviciosRepository.save(producto);
  }
  async remove(id: number): Promise<Servicio> {
    const servicio = await this.findOne(id);
    return this.serviciosRepository.softRemove(servicio);
  }
}
