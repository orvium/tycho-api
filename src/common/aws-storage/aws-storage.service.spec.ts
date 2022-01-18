import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsStorageService } from './aws-storage.service';

describe('AwsStorageService', () => {
  let service: AwsStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsStorageService,
        { provide: ConfigService, useValue: { get() {return 'test'}}}
      ],
    }).compile();

    service = module.get<AwsStorageService>(AwsStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
