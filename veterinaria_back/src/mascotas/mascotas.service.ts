import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mascota } from './entities/mascota.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MascotasService {
  constructor(
    @InjectRepository(Mascota) private mascotasRepository: Repository<Mascota>,
  ) {}

  async create(createMascotaDto: CreateMascotaDto): Promise<Mascota> {
    let mascota = await this.mascotasRepository.findOneBy({
      nombre: createMascotaDto.nombre.trim(),
    });
    if (mascota) throw new ConflictException('La mascota ya está registrada');

    mascota = new Mascota();
    Object.assign(mascota, createMascotaDto);
    return this.mascotasRepository.save(mascota);
  }

  async findAll(): Promise<Mascota[]> {
    return this.mascotasRepository.find({
      relations: { clientes: true},
      select:{
        id:true,
        nombre:true,
        raza:true,
        clientes:{id:true,nombres:true}
      }
    });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotasRepository.findOneBy({ id });
    if (!mascota) throw new NotFoundException('Mascota no encontrada');
    return mascota;
  }

  async update(
    id: number,
    updateMascotaDto: UpdateMascotaDto,
  ): Promise<Mascota> {
    const mascota = await this.findOne(id);
    Object.assign(mascota, updateMascotaDto);
    return this.mascotasRepository.save(mascota);
  }

  async remove(id: number): Promise<Mascota> {
    const mascota = await this.findOne(id);
    return this.mascotasRepository.softRemove(mascota);
  }
}
