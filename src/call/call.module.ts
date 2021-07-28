import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from 'src/entities/call.entity';
import { Consumer, ConsumerSchema } from 'src/entities/consumer.entity';
import { Donor, DonorSchema } from 'src/entities/donor.entity';
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
  providers: [CallService]
})
export class CallModule {}
