import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RoleEntity } from './entities/roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
