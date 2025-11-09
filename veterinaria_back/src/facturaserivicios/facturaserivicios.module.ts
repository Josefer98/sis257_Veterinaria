import { Module } from '@nestjs/common';
import { FacturaseriviciosService } from './facturaserivicios.service';
import { FacturaseriviciosController } from './facturaserivicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facturaserivicio } from './entities/facturaserivicio.entity';

@Module({

  imports: [
    TypeOrmModule.forFeature([Facturaserivicio]),
  ],
  controllers: [FacturaseriviciosController],
  providers: [FacturaseriviciosService],
})
export class FacturaseriviciosModule { }
