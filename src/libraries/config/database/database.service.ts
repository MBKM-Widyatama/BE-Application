import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './database.config';
import { CommonDBSubscriber } from 'src/libraries/common';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const config: TypeOrmModuleOptions = {
      ...DatabaseConfig,
      type: 'postgres',
      autoLoadEntities: true,
      subscribers: [CommonDBSubscriber],
      synchronize: this.configService.get('APP_MODE') === 'development',
    };

    return { ...config };
  }
}
