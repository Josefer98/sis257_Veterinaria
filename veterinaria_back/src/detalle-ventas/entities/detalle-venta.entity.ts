import { Producto } from 'src/productos/entities/producto.entity';
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

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_venta' })
  idVenta: number;

  @Column('varchar', { name: 'tipo_item', length: 50 })
  tipoItem: string;

  @Column('integer', { name: 'id_servicio', nullable: true })
  idServicio: number | null;

  @Column('integer', { name: 'id_producto', nullable: true })
  idProducto: number | null;

  @Column('int', { name: 'cantidad' })
  cantidad: number;

  @Column('decimal', { name: 'precio_unitario', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('decimal', { name: 'subtotal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Venta, (venta) => venta.detalleVentas)
  @JoinColumn({ name: 'id_venta', referencedColumnName: 'id' })
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.detalleVentas)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;

  @ManyToOne(() => Servicio, (servicio) => servicio.detalleVentas)
  @JoinColumn({ name: 'id_servicio', referencedColumnName: 'id' })
  servicio: Servicio;
}
