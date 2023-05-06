import { Test, TestingModule } from '@nestjs/testing';
import { MasterFacultiesController } from './master-faculties.controller';

describe('MasterFacultiesController', () => {
  let controller: MasterFacultiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterFacultiesController],
    }).compile();

    controller = module.get<MasterFacultiesController>(
      MasterFacultiesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
