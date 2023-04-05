import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { UsersModule } from 'src/models/users/users.module';
import { RolesModule } from 'src/models/roles/roles.module';

@Module({
  imports: [UsersModule, RolesModule],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
