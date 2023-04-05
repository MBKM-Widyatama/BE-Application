import { Test, TestingModule } from '@nestjs/testing';
import { SingleSignOnService } from './single-sign-on.service';

describe('SingleSignOnService', () => {
  let service: SingleSignOnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingleSignOnService],
    }).compile();

    service = module.get<SingleSignOnService>(SingleSignOnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
