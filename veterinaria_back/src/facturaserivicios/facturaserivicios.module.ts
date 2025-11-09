import { Module } from '@nestjs/common';
import { FacturaseriviciosService } from './facturaserivicios.service';
import { FacturaseriviciosController } from './facturaserivicios.controller';

@Module({
  controllers: [FacturaseriviciosController],
  providers: [FacturaseriviciosService],
})
export class FacturaseriviciosModule {}
