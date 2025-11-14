import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('facturaserivicios')
export class Facturaserivicio {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_venta' })
  idVenta: number;

  @Column('integer', { name: 'id_servicio' })
  idServicio: number;
  @Column('int', { name: 'cantidad' })
  cantidad: number;
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Servicio, (servicio) => servicio.facturaserivicios)
  @JoinColumn({ name: 'id_servicio', referencedColumnName: 'id' })
  servicio: Servicio;

  @ManyToOne(() => Venta, (venta) => venta.facturaserivicios)
  @JoinColumn({ name: 'id_venta', referencedColumnName: 'id' })
  venta: Venta;
}
