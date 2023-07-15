import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import configuration from "src/configuration/configuration";
import {NeutronDeployHistoryModule} from "src/neutron-deploy-history/neutron-deploy-history.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    NeutronDeployHistoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
