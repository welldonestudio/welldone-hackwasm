import { Test, TestingModule } from '@nestjs/testing';
import {NeutronDeployHistoryService} from "src/neutron-deploy-history/neutron-deploy-history.service";
import {NeutronDeployHistoryModule} from "src/neutron-deploy-history/neutron-deploy-history.module";

describe('NeutronDeployHistoryService', () => {
  let module: TestingModule;
  let service: NeutronDeployHistoryService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NeutronDeployHistoryModule],
    }).compile();

    service = module.get<NeutronDeployHistoryService>(
      NeutronDeployHistoryService,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
