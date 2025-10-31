import { Test, TestingModule } from '@nestjs/testing';
import { FacturaProductosService } from './factura-productos.service';

describe('FacturaProductosService', () => {
  let service: FacturaProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacturaProductosService],
    }).compile();

    service = module.get<FacturaProductosService>(FacturaProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
