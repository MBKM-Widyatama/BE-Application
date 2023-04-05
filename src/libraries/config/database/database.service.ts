import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './database.config';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const config: TypeOrmModuleOptions = {
      ...DatabaseConfig,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: this.configService.get('APP_MODE') === 'development',
    };

    return { ...config };
  }
}
