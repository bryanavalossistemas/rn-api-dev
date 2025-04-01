import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  synchronize: true,
  autoLoadEntities: true,
});
