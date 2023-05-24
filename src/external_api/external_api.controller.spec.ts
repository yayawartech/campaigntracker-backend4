import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAPIController } from './external_api.controller';

describe('ExternalAPIController', () => {
  let controller: ExternalAPIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalAPIController],
    }).compile();

    controller = module.get<ExternalAPIController>(ExternalAPIController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
