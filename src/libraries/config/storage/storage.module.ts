import { MulterModule } from '@nestjs/platform-express';
import { Module } from '@nestjs/common';
import { MulterConfigurationService } from './multer/multer.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigurationService,
    }),
  ],
})
export class StorageModule {}
