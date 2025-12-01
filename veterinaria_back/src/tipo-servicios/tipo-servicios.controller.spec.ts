import { Test, TestingModule } from '@nestjs/testing';
import { TipoServiciosController } from './tipo-servicios.controller';
import { TipoServiciosService } from './tipo-servicios.service';

describe('TipoServiciosController', () => {
  let controller: TipoServiciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoServiciosController],
      providers: [TipoServiciosService],
    }).compile();

    controller = module.get<TipoServiciosController>(TipoServiciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
