import { Module } from '@nestjs/common';
import { FacturaProductosService } from './factura-productos.service';
import { FacturaProductosController } from './factura-productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaProducto } from './entities/factura-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacturaProducto])],
  controllers: [FacturaProductosController],
  providers: [FacturaProductosService],
})
export class FacturaProductosModule {}
