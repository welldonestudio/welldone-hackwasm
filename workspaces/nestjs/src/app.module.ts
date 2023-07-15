import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configuration/configuration';
import { NeutronDeployHistoryModule } from 'src/neutron-deploy-history/neutron-deploy-history.module';
import { S3Module } from 'src/s3/s3.module';
import { NeutronVerificationModule } from 'src/neutron-verification/neutron-verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    NeutronDeployHistoryModule,
    NeutronVerificationModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
