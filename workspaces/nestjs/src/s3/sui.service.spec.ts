import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from 'src/s3/s3.service';

describe('S3Service', () => {
  let module: TestingModule;
  let service: S3Service;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
