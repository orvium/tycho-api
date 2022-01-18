import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsStorageService } from '../common/aws-storage/aws-storage.service';
import { Call, CallSchema } from '../entities/call.entity';
import { Dataset, DatasetSchema } from '../entities/dataset.entity';
import { Donor, DonorSchema } from '../entities/donor.entity';
import { DonorDatasetController } from './donor-dataset/donor-dataset.controller';
import { DonorDatasetService } from './donor-dataset/donor-dataset.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donor.name,
        schema: DonorSchema
      },
      {
        name: Call.name,
        schema: CallSchema
      },
      {
        name: Dataset.name,
        schema: DatasetSchema
      },
    ]),
  ],
  controllers: [DonorDatasetController],
  providers: [DonorDatasetService, AwsStorageService, ConfigService]
})
export class DonorDatasetModule {}
