import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { UsersModule } from 'src/models/users/users.module';
import { RolesModule } from 'src/models/roles/roles.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, RolesModule, PassportModule],
  controllers: [AuthenticationController],
  providers: [LocalStrategy],
  exports: [LocalStrategy],
})
export class AuthenticationModule {}
