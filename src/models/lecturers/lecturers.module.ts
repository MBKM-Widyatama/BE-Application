import { Module } from '@nestjs/common';
import { LecturersService } from './services/lecturers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturerEntity } from './entities/lecturers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LecturerEntity])],
  providers: [LecturersService],
  exports: [LecturersService],
})
export class LecturersModule {}
