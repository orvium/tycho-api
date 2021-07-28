import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from 'src/entities/call.entity';
import { Donor, DonorSchema } from 'src/entities/donor.entity';
import { DonorController } from './donor/donor.controller';
import { DonorService } from './donor/donor.service';

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
    ]),
  ],
  controllers: [DonorController],
  providers: [DonorService]
})
export class DonorModule {}
