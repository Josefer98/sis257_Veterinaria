import { Cliente } from 'src/clientes/entities/cliente.entity';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';
import { Mascota } from 'src/mascotas/entities/mascota.entity';
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

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_cliente' })
  idCliente: number;

  @Column('integer', { name: 'id_mascota', nullable: true })
  idMascota?: number;

  @Column('date', { name: 'fecha', default: () => 'CURRENT_DATE' })
  fecha: Date;

  @Column('decimal', { name: 'total', precision: 10, scale: 2, default: 0.0 })
  total: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente?: Cliente;

  @ManyToOne(() => Mascota, { nullable: true })
  @JoinColumn({ name: 'id_mascota', referencedColumnName: 'id' })
  mascota?: Mascota;

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta)
  detalleVentas: DetalleVenta[];
}
