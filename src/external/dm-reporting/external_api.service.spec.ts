import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAPIService } from './external_api.service';

describe('ExternalAPIService', () => {
  let service: ExternalAPIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalAPIService],
    }).compile();

    service = module.get<ExternalAPIService>(ExternalAPIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
