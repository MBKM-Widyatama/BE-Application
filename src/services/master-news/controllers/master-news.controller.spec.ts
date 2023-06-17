import { Test, TestingModule } from '@nestjs/testing';
import { MasterNewsController } from './master-news.controller';

describe('MasterNewsController', () => {
  let controller: MasterNewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterNewsController],
    }).compile();

    controller = module.get<MasterNewsController>(MasterNewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
