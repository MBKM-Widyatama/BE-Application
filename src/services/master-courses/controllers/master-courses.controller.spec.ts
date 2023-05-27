import { Test, TestingModule } from '@nestjs/testing';
import { MasterCoursesController } from './master-courses.controller';

describe('MasterCoursesController', () => {
  let controller: MasterCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterCoursesController],
    }).compile();

    controller = module.get<MasterCoursesController>(MasterCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
