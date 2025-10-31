import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacturaProductosService } from './factura-productos.service';
import { CreateFacturaProductoDto } from './dto/create-factura-producto.dto';
import { UpdateFacturaProductoDto } from './dto/update-factura-producto.dto';

@Controller('factura-productos')
export class FacturaProductosController {
  constructor(private readonly facturaProductosService: FacturaProductosService) {}

  @Post()
  create(@Body() createFacturaProductoDto: CreateFacturaProductoDto) {
    return this.facturaProductosService.create(createFacturaProductoDto);
  }

  @Get()
  findAll() {
    return this.facturaProductosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturaProductosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacturaProductoDto: UpdateFacturaProductoDto) {
    return this.facturaProductosService.update(+id, updateFacturaProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturaProductosService.remove(+id);
  }
}
