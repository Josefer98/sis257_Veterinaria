import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta, Producto, Servicio]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
