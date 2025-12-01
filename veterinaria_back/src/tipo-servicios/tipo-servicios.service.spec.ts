import { Test, TestingModule } from '@nestjs/testing';
import { TipoServiciosService } from './tipo-servicios.service';

describe('TipoServiciosService', () => {
  let service: TipoServiciosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoServiciosService],
    }).compile();

    service = module.get<TipoServiciosService>(TipoServiciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
