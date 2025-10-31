import { FacturaProducto } from "src/factura-productos/entities/factura-producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => FacturaProducto, facturaProducto => facturaProducto.producto)
    facturaProductos: FacturaProducto[];
}
