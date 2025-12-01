import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoServiciosService } from './tipo-servicios.service';
import { CreateTipoServicioDto } from './dto/create-tipo-servicio.dto';
import { UpdateTipoServicioDto } from './dto/update-tipo-servicio.dto';

@Controller('tipo-servicios')
export class TipoServiciosController {
  constructor(private readonly tipoServiciosService: TipoServiciosService) {}

  @Post()
  create(@Body() createTipoServicioDto: CreateTipoServicioDto) {
    return this.tipoServiciosService.create(createTipoServicioDto);
  }

  @Get()
  findAll() {
    return this.tipoServiciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoServiciosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoServicioDto: UpdateTipoServicioDto) {
    return this.tipoServiciosService.update(+id, updateTipoServicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoServiciosService.remove(+id);
  }
}
