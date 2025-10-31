import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('factura_productos')
export class FacturaProducto {
  @PrimaryGeneratedColumn('identity')
    id: number;

    @Column('integer', { name: 'id_venta' })
    idVenta: number;
  
    @Column('integer', { name: 'id_producto' })
    idProducto: number;

    @Column('int', { name: 'cantidad' })
    cantidad: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @ManyToOne(() => Producto, producto => producto.facturaProductos)
    @JoinColumn({name: 'id_producto' , referencedColumnName: 'id'})
    producto: Producto; 
}
