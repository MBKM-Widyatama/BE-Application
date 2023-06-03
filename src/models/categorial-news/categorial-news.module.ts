import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorialNewsEntity } from './entities/categorial-news.entity';
import { CategorialNewsService } from './services/categorial-news.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategorialNewsEntity])],
  providers: [CategorialNewsService],
  exports: [CategorialNewsService],
})
export class CategorialNewsModule {}
