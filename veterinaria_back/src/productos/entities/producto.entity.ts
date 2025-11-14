import { FacturaProducto } from 'src/factura-productos/entities/factura-producto.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { name: 'nombre', length: 100 })
  nombre: string;

  @Column('varchar', { name: 'categoria', length: 100 })
  categoria: string;

  @Column('varchar', { name: 'descripcion', length: 555 })
  descripcion: string;

  @Column('decimal', { name: 'precio', precision: 10, scale: 2 })
  precio: number;

  @Column('int', { name: 'stock' })
  stock: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(
    () => FacturaProducto,
    (facturaProducto) => facturaProducto.producto,
  )
  facturaProductos: FacturaProducto[];
}
