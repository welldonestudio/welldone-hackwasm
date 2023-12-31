import { Module } from '@nestjs/common';
import { S3Controller } from 'src/s3/s3.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
