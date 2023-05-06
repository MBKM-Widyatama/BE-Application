import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/services/authentication/authentication.module';
import { MasterRolesModule } from 'src/services/master-roles/master-roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/libraries/config/database/database.service';
import { FacultiesModule } from './models/faculties/faculties.module';
import { LecturersModule } from './models/lecturers/lecturers.module';
import { MasterFacultiesModule } from './services/master-faculties/master-faculties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('APP_THROTTLE_TTL'),
        limit: config.get('APP_THROTTLER_MAX_REQUEST'),
      }),
    }),
    AuthenticationModule,
    MasterRolesModule,
    FacultiesModule,
    LecturersModule,
    MasterFacultiesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
