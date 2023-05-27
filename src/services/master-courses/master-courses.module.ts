import { Module } from '@nestjs/common';
import { MasterCoursesController } from './controllers/master-courses.controller';
import { CoursesModule } from 'src/models/courses/courses.module';

@Module({
  controllers: [MasterCoursesController],
  imports: [CoursesModule],
})
export class MasterCoursesModule {}
