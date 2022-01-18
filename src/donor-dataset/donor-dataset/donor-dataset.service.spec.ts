import { Test, TestingModule } from '@nestjs/testing';
import { AwsStorageService } from '../../common/aws-storage/aws-storage.service';
import { DonorDatasetService } from './donor-dataset.service';

describe('DonorDatasetService', () => {
  let service: DonorDatasetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AwsStorageService, useValue: {} },
        { provide: DonorDatasetService, useValue: {} },
        { provide: 'CallModel', useValue: {} },
        { provide: 'DatasetModel', useValue: {} },
      ],
    }).compile();

    service = module.get<DonorDatasetService>(DonorDatasetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
