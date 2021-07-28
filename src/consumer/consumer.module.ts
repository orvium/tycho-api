import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from 'src/entities/call.entity';
import { Consumer, ConsumerSchema } from 'src/entities/consumer.entity';
import { Donor, DonorSchema } from 'src/entities/donor.entity';
import { ConsumerController } from './consumer/consumer.controller';
import { ConsumerService } from './consumer/consumer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Consumer.name,
        schema: ConsumerSchema
      },
      {
        name: Call.name,
        schema: CallSchema
      },
      {
        name: Donor.name,
        schema: DonorSchema
      }
    ]),
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}
