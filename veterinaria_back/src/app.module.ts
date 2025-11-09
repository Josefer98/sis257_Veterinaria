import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { FacturaProductosModule } from './factura-productos/factura-productos.module';
import { VentasModule } from './ventas/ventas.module';
import { ServiciosModule } from './servicios/servicios.module';
import { FacturaseriviciosModule } from './facturaserivicios/facturaserivicios.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ClientesModule,
    ProductosModule,
    FacturaProductosModule,
    VentasModule,
    ServiciosModule,
    FacturaseriviciosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
