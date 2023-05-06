import { Module } from '@nestjs/common';
import { FacultiesService } from './services/faculties.service';
import { FacultiesEntity } from './entities/faculties.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FacultiesEntity])],
  providers: [FacultiesService],
  exports: [FacultiesService],
})
export class FacultiesModule {}
