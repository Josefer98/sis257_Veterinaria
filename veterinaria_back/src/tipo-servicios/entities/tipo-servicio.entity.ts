import { Servicio } from 'src/servicios/entities/servicio.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tipo_servicios')
export class TipoServicio {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column('varchar', { name: 'nombre', length: 100 })
  nombre: string;
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Servicio, (servicio) => servicio.tipoServicio)
  servicios: Servicio[];
}
