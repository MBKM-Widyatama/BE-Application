import { Module } from '@nestjs/common';
import { CoursesService } from './services/courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesEntity } from './entities/courses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoursesEntity])],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
