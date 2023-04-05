import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export const DatabaseConfig = {
  host: process.env.DB_MAIN_HOST,
  port: +process.env.DB_MAIN_PORT,
  database: process.env.DB_MAIN_DATABASE,
  username: process.env.DB_MAIN_USERNAME,
  password: process.env.DB_MAIN_PASSWORD,
  entities: [],
  migrations: [],
  subscribers: [],
  migrationsTableName: 'typeorm_migrations',
  logging: process.env.APP_MODE == 'production' ? false : true,
  namingStrategy: new SnakeNamingStrategy(),
};
