import { Module } from '@nestjs/common';
import { EntityModule } from '../entity.module';
import { NeutronDeployHistoryService } from './neutron-deploy-history.service';
import { NeutronDeployHistoryController } from './neutron-deploy-history.controller';

@Module({
  imports: [EntityModule],
  providers: [NeutronDeployHistoryService],
  controllers: [NeutronDeployHistoryController],
  exports: [NeutronDeployHistoryService],
})
export class NeutronDeployHistoryModule {}
