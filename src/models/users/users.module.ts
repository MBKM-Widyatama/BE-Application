import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/libraries/config/jwt/jwt-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
