import { Controller, Get, Query } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';

@Controller('s3Proxy')
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Get('')
  async downloadUrl(
    @Query('bucket') bucket: string,
    @Query('fileKey') fileKey: string,
  ) {
    await this.s3Service.downloadUrl(bucket, fileKey);
  }
}
