import { Cliente } from 'src/clientes/entities/cliente.entity';
import { FacturaProducto } from 'src/factura-productos/entities/factura-producto.entity';
import { Facturaserivicio } from 'src/facturaserivicios/entities/facturaserivicio.entity';
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

  @Column('date', { name: 'fecha' })
  fecha: Date;

  @Column('integer', { name: 'total' })
  total: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente: Cliente;

  @OneToMany(() => FacturaProducto, (facturaProducto) => facturaProducto.venta)
  facturaProductos: FacturaProducto[];

  @OneToMany(
    () => Facturaserivicio,
    (facturaserivicio) => facturaserivicio.venta,
  )
  facturaserivicios: Facturaserivicio[];
}
