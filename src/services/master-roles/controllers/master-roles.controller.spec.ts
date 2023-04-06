import { Test, TestingModule } from '@nestjs/testing';
import { MasterRolesController } from '../controllers/master-roles.controller';

describe('MasterRolesController', () => {
  let controller: MasterRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterRolesController],
    }).compile();

    controller = module.get<MasterRolesController>(MasterRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
