import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'process';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default () => {
  const database: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'wds-code',
    namingStrategy: new SnakeNamingStrategy(),
    legacySpatialSupport: false,
    entities: [],
    synchronize: false,
    autoLoadEntities: true,
    logging: true,
  };

  return {
    database,
  };
};
