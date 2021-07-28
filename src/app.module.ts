import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorModule } from './donor/donor.module';
import { ConsumerModule } from './consumer/consumer.module';
import { CallModule } from './call/call.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/tycho-db',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    ),
    DonorModule,
    ConsumerModule,
    CallModule,
    LoginModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
