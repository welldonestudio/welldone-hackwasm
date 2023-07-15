import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/configuration/configuration';
import { ENTITIES } from 'src/entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(configuration().database),
    TypeOrmModule.forFeature(ENTITIES),
  ],
  exports: [TypeOrmModule.forFeature(ENTITIES)],
})
export class EntityModule {}
