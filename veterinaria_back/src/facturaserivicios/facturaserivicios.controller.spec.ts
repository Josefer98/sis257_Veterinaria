import { Test, TestingModule } from '@nestjs/testing';
import { FacturaseriviciosController } from './facturaserivicios.controller';
import { FacturaseriviciosService } from './facturaserivicios.service';

describe('FacturaseriviciosController', () => {
  let controller: FacturaseriviciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturaseriviciosController],
      providers: [FacturaseriviciosService],
    }).compile();

    controller = module.get<FacturaseriviciosController>(FacturaseriviciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
