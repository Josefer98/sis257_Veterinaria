import { Test, TestingModule } from '@nestjs/testing';
import { FacturaseriviciosService } from './facturaserivicios.service';

describe('FacturaseriviciosService', () => {
  let service: FacturaseriviciosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacturaseriviciosService],
    }).compile();

    service = module.get<FacturaseriviciosService>(FacturaseriviciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
