import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Consumer, ConsumerSchema } from '../entities/consumer.entity';
import { Donor, DonorSchema } from '../entities/donor.entity';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donor.name,
        schema: DonorSchema
      },
      {
        name: Consumer.name,
        schema: ConsumerSchema
      }
    ]),
  ],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
