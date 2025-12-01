import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';


@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentasRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto) private productosRepository: Repository<Producto>,
    @InjectRepository(Servicio) private serviciosRepository: Repository<Servicio>,
    private dataSource: DataSource
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    return await this.dataSource.transaction(async (manager)=>{
      const venta = manager.create(Venta, {
        idCliente: createVentaDto.idCliente,
        idMascota: createVentaDto.idMascota,
        fecha: new Date(),
        total: 0,
      });
      await manager.save(venta);

      let totalVenta = 0;
      for (const item of createVentaDto.items) {
        let precioUnitario = 0;
        //Producto
        if(item.tipoItem === 'producto'){
          const producto =  await manager.findOne(Producto, {where:{id: item.idProducto}});
          if(!producto) throw new NotFoundException(`Producto con id ${item.idProducto} no encontrado`);
          if(producto.stock < item.cantidad) throw new ConflictException(`Stock insuficiente para el producto ${producto.nombre}`);
          
          producto.stock -= item.cantidad;
          await manager.save(producto);
          precioUnitario = Number(producto.precio);
        }
        //Servicio
        if(item.tipoItem === 'servicio'){
          const servicio =  await manager.findOne(Servicio, {where:{id: item.idServicio}});
          if(!servicio) throw new NotFoundException(`Servicio con id ${item.idServicio} no encontrado`);
          precioUnitario = Number(servicio.precio);
        }
        const subtotal = precioUnitario * item.cantidad;
        totalVenta += subtotal;
        const detalle = manager.create(DetalleVenta, {
          idVenta: venta.id,
          tipoItem: item.tipoItem,
          idProducto: item.idProducto || null,
          idServicio: item.idServicio || null,
          cantidad: item.cantidad,
          precioUnitario,
          subtotal,
        });
        await  manager.save(detalle);
      }
      venta.total = totalVenta;
      await manager.save(venta);
      
      return venta;
    })
  }

  async findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({
      relations: { cliente: true },
      select: {
        id: true,
        fecha: true,
        total: true,
        cliente: { id: true, nombres: true, apellidos: true },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    Object.assign(venta, updateVentaDto);
    delete venta.cliente;
    return this.ventasRepository.save(venta);
  }

  async remove(id: number): Promise<Venta> {
    const venta = await this.findOne(id);
    return this.ventasRepository.softRemove(venta);
  }
}
