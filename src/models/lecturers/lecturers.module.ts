import { Module } from '@nestjs/common';
import { LecturersService } from './services/lecturers.service';

@Module({
  providers: [LecturersService],
})
export class LecturersModule {}
