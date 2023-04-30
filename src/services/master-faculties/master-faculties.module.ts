import { Module } from '@nestjs/common';
import { MasterFacultiesController } from './controllers/master-faculties.controller';
import { FacultiesModule } from 'src/models/faculties/faculties.module';

@Module({
  imports: [FacultiesModule],
  controllers: [MasterFacultiesController],
})
export class MasterFacultiesModule {}
