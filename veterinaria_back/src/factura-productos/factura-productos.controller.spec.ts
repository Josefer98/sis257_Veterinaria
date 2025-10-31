import { Test, TestingModule } from '@nestjs/testing';
import { FacturaProductosController } from './factura-productos.controller';
import { FacturaProductosService } from './factura-productos.service';

describe('FacturaProductosController', () => {
  let controller: FacturaProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturaProductosController],
      providers: [FacturaProductosService],
    }).compile();

    controller = module.get<FacturaProductosController>(FacturaProductosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
