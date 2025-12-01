import { Module } from '@nestjs/common';
import { TipoServiciosService } from './tipo-servicios.service';
import { TipoServiciosController } from './tipo-servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoServicio } from './entities/tipo-servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoServicio])],
  controllers: [TipoServiciosController],
  providers: [TipoServiciosService],
})
export class TipoServiciosModule {}
