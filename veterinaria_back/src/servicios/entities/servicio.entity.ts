import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';
import { TipoServicio } from 'src/tipo-servicios/entities/tipo-servicio.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('servicios')
export class Servicio {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_tipo_servicio' })
  idTipoServicio: number;
  @Column('varchar', { name: 'nombre', length: 100 })
  nombre: string;

  @Column('varchar', { name: 'descripcion', length: 500 })
  descripcion: string;

  @Column('decimal', { name: 'precio', precision: 10, scale: 2 })
  precio: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.servicio)
  detalleVentas: DetalleVenta[];

  @ManyToOne(() => TipoServicio, (tipoServicio) => tipoServicio.servicios)
  @JoinColumn({ name: 'id_tipo_servicio', referencedColumnName: 'id' })
  tipoServicio: TipoServicio;
}
