import { Test, TestingModule } from '@nestjs/testing';
import { NeutronVerificationService } from 'src/neutron-verification/neutron-verification.service';
import { NeutronVerificationModule } from 'src/neutron-verification/neutron-verification.module';

describe('NeutronDeployHistoryService', () => {
  let module: TestingModule;
  let service: NeutronVerificationService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NeutronVerificationModule],
    }).compile();

    service = module.get<NeutronVerificationService>(
      NeutronVerificationService,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
