import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { UsersModule } from 'src/models/users/users.module';
import { RolesModule } from 'src/models/roles/roles.module';
import { PassportModule } from '@nestjs/passport';

// Strategies - Passport
import { AuthenticationJWTStrategy } from './strategies/authentication-jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, RolesModule, PassportModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationJWTStrategy, LocalStrategy],
  exports: [AuthenticationJWTStrategy, LocalStrategy],
})
export class AuthenticationModule {}
