import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { Roles } from './entities/roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
