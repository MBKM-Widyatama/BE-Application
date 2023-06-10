import { Test, TestingModule } from '@nestjs/testing';
import { MasterCategorialNewsController } from './master-categorial-news.controller';

describe('MasterCategorialNewsController', () => {
  let controller: MasterCategorialNewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterCategorialNewsController],
    }).compile();

    controller = module.get<MasterCategorialNewsController>(
      MasterCategorialNewsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
