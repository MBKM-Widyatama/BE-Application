import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/libraries/config/jwt/jwt-config.service';
import { VerificationEmailModule } from 'src/libraries/common/mailers/verification-email/verification-email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    VerificationEmailModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
