import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTipoServicioDto } from './dto/create-tipo-servicio.dto';
import { UpdateTipoServicioDto } from './dto/update-tipo-servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoServicio } from './entities/tipo-servicio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoServiciosService {
  constructor(
    @InjectRepository(TipoServicio)
    private tiposerviciosRepository: Repository<TipoServicio>,
  ) {}
  async create(
    createTipoServicioDto: CreateTipoServicioDto,
  ): Promise<TipoServicio> {
    if (createTipoServicioDto.nombre) {
      const tipoServicioExistente =
        await this.tiposerviciosRepository.findOneBy({
          nombre: createTipoServicioDto.nombre.trim(),
        });
      if (tipoServicioExistente)
        throw new ConflictException('El tipo de servicio ya está registrado');
    }
    const tipoServicio = new TipoServicio();
    Object.assign(tipoServicio, createTipoServicioDto);
    return this.tiposerviciosRepository.save(tipoServicio);
  }

  async findAll(): Promise<TipoServicio[]> {
    return this.tiposerviciosRepository.find();
  }

  async findOne(id: number): Promise<TipoServicio> {
    const tipoServicio = await this.tiposerviciosRepository.findOneBy({ id });
    if (!tipoServicio)
      throw new NotFoundException('Tipo de servicio no encontrado');
    return tipoServicio;
  }

  async update(
    id: number,
    updateTipoServicioDto: UpdateTipoServicioDto,
  ): Promise<TipoServicio> {
    const tipoServicio = await this.findOne(id);
    Object.assign(tipoServicio, updateTipoServicioDto);
    return this.tiposerviciosRepository.save(tipoServicio);
  }

  async remove(id: number): Promise<TipoServicio> {
    const tipoServicio = await this.findOne(id);
    return this.tiposerviciosRepository.softRemove(tipoServicio);
  }
}
