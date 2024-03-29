import { IsExistsConstraint } from './libraries/common';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { StorageModule } from './libraries/config/storage/storage.module';
import { AuthenticationModule } from 'src/services/authentication/authentication.module';
import { MasterRolesModule } from 'src/services/master-roles/master-roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/libraries/config/database/database.service';
import { FacultiesModule } from './models/faculties/faculties.module';
import { LecturersModule } from './models/lecturers/lecturers.module';
import { MasterFacultiesModule } from './services/master-faculties/master-faculties.module';
import { MasterLecturerModule } from './services/master-lecturer/master-lecturer.module';
import { CoursesModule } from './models/courses/courses.module';
import { MasterCoursesModule } from './services/master-courses/master-courses.module';
import { CategorialNewsModule } from './models/categorial-news/categorial-news.module';
import { MasterCategorialNewsModule } from './services/master-categorial-news/master-categorial-news.module';
import { NewsModule } from './models/news/news.module';
import { MasterNewsModule } from './services/master-news/master-news.module';

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
    StorageModule,
    AuthenticationModule,
    MasterRolesModule,
    FacultiesModule,
    LecturersModule,
    MasterFacultiesModule,
    MasterLecturerModule,
    CoursesModule,
    MasterCoursesModule,
    CategorialNewsModule,
    MasterCategorialNewsModule,
    NewsModule,
    MasterNewsModule,
  ],
  providers: [
    IsExistsConstraint,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
