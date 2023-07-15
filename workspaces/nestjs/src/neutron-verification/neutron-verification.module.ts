import { Module } from '@nestjs/common';
import { EntityModule } from 'src/entity.module';
import { NeutronVerificationController } from 'src/neutron-verification/neutron-verification.controller';
import { NeutronVerificationService } from 'src/neutron-verification/neutron-verification.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [EntityModule, S3Module],
  controllers: [NeutronVerificationController],
  providers: [NeutronVerificationService],
  exports: [NeutronVerificationService],
})
export class NeutronVerificationModule {}
