import { Module } from '@nestjs/common';
import { LecturersModule } from 'src/models/lecturers/lecturers.module';
import { MasterLecturerController } from './controllers/master-lecturer.controller';

@Module({
  imports: [LecturersModule],
  providers: [],
  controllers: [MasterLecturerController],
})
export class MasterLecturerModule {}
