import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacturaseriviciosService } from './facturaserivicios.service';
import { CreateFacturaserivicioDto } from './dto/create-facturaserivicio.dto';
import { UpdateFacturaserivicioDto } from './dto/update-facturaserivicio.dto';

@Controller('facturaserivicios')
export class FacturaseriviciosController {
  constructor(private readonly facturaseriviciosService: FacturaseriviciosService) {}

  @Post()
  create(@Body() createFacturaserivicioDto: CreateFacturaserivicioDto) {
    return this.facturaseriviciosService.create(createFacturaserivicioDto);
  }

  @Get()
  findAll() {
    return this.facturaseriviciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturaseriviciosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacturaserivicioDto: UpdateFacturaserivicioDto) {
    return this.facturaseriviciosService.update(+id, updateFacturaserivicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturaseriviciosService.remove(+id);
  }
}
