import { Module } from '@nestjs/common';
import { MasterCategorialNewsController } from './controllers/master-categorial-news.controller';
import { CategorialNewsModule } from 'src/models/categorial-news/categorial-news.module';

@Module({
  imports: [CategorialNewsModule],
  controllers: [MasterCategorialNewsController],
})
export class MasterCategorialNewsModule {}
