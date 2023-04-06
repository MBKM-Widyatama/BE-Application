import { Module } from '@nestjs/common';
import { MasterRolesController } from './controllers/master-roles.controller';
import { RolesModule } from 'src/models/roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [MasterRolesController],
})
export class MasterRolesModule {}
