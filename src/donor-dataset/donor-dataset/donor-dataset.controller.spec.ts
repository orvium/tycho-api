import { Test, TestingModule } from '@nestjs/testing';
import { AwsStorageService } from '../../common/aws-storage/aws-storage.service';
import { DonorDatasetController } from './donor-dataset.controller';
import { DonorDatasetService } from './donor-dataset.service';

describe('DonorDatasetController', () => {
  let controller: DonorDatasetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonorDatasetController],
      providers: [
        { provide: AwsStorageService, useValue: {} },
        { provide: DonorDatasetService, useValue: {} },
        { provide: 'CallModel', useValue: {} },
        { provide: 'DatasetModel', useValue: {} },
      ]
    }).compile();

    controller = module.get<DonorDatasetController>(DonorDatasetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
