import { Test, TestingModule } from '@nestjs/testing';
import { CategorialNewsService } from './categorial-news.service';

describe('CategorialNewsService', () => {
  let service: CategorialNewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorialNewsService],
    }).compile();

    service = module.get<CategorialNewsService>(CategorialNewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
