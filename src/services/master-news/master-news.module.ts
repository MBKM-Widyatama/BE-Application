import { Module } from '@nestjs/common';
import { MasterNewsController } from './controllers/master-news.controller';
import { NewsModule } from 'src/models/news/news.module';

@Module({
  imports: [NewsModule],
  controllers: [MasterNewsController],
})
export class MasterNewsModule {}
