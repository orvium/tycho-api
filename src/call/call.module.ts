import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsStorageService } from '../common/aws-storage/aws-storage.service';
import { Call, CallSchema } from '../entities/call.entity';
import { Consumer, ConsumerSchema } from '../entities/consumer.entity';
import { Donor, DonorSchema } from '../entities/donor.entity';
import { CallController } from './call/call.controller';
import { CallService } from './call/call.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Call.name,
        schema: CallSchema
      },
      {
        name: Consumer.name,
        schema: ConsumerSchema
      },
      {
        name: Donor.name,
        schema: DonorSchema
      }
    ]),
  ],
  controllers: [CallController],
  providers: [CallService, AwsStorageService, ConfigService]
})
export class CallModule {}
