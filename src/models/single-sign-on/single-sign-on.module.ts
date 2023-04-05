import { Module } from '@nestjs/common';
import { SingleSignOnService } from './services/single-sign-on.service';

@Module({
  providers: [SingleSignOnService],
})
export class SingleSignOnModule {}
