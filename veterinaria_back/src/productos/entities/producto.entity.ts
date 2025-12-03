import { Categoria } from 'src/categorias/entities/categoria.entity';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_categoria' })
  idCategoria: number;

  @Column('varchar', { name: 'nombre', length: 100 })
  nombre: string;

  @Column('varchar', { name: 'descripcion', length: 555 })
  descripcion: string;

  @Column('decimal', { name: 'precio', precision: 10, scale: 2 })
  precio: number;

  @Column('int', { name: 'stock' })
  stock: number;

  @Column('varchar', { name: 'imagen_url', length: 500, nullable: true })
  imagenUrl: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.producto)
  detalleVentas: DetalleVenta[];

  @ManyToOne(()=> Categoria, (categoria)=> categoria.productos)
  @JoinColumn({name: 'id_categoria', referencedColumnName: 'id'})
  categoria: Categoria;
}
