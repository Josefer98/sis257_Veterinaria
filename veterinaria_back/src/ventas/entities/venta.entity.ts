import { Cliente } from "src/clientes/entities/cliente.entity";
import { FacturaProducto } from "src/factura-productos/entities/factura-producto.entity";
import { Facturaserivicio } from "src/facturaserivicios/entities/facturaserivicio.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Cliente, cliente => cliente.ventas)
    @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
    cliente: Cliente;

    @OneToMany(()=> FacturaProducto, facturaProducto => facturaProducto.venta)
    facturaProductos: FacturaProducto[];

    @OneToMany(()=>Facturaserivicio, facturaserivicio => facturaserivicio.venta )
    facturaserivicios: Facturaserivicio[];

    

}
