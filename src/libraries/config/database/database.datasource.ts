import { DataSource } from 'typeorm';
import { DatabaseConfig } from './database.config';
import path = require('path');

/**
 * https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
 */
console.log(
  path.join(__dirname, '../../../../src/libraries/database/migrations'),
  'DatabaseConfig',
);

export const AppDataSource = new DataSource({
  ...DatabaseConfig,
  type: 'postgres',
  entities: [path.join(__dirname, '../../../../src/**/*.entity.{ts,js}')],
  migrations: [
    path.join(
      __dirname,
      '../../../../src/libraries/database/migrations/*.{ts,js}',
    ),
  ],
});
