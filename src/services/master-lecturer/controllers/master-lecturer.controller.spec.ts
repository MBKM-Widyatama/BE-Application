import { Test, TestingModule } from '@nestjs/testing';
import { MasterLecturerController } from './master-lecturer.controller';

describe('MasterLecturerController', () => {
  let controller: MasterLecturerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterLecturerController],
    }).compile();

    controller = module.get<MasterLecturerController>(MasterLecturerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
