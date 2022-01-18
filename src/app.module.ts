import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorModule } from './donor/donor.module';
import { ConsumerModule } from './consumer/consumer.module';
import { CallModule } from './call/call.module';
import { LoginModule } from './login/login.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { DonorDatasetModule } from './donor-dataset/donor-dataset.module';
import * as Joi from 'joi';
import { environment } from './environments/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ENVIRONMENT: Joi.required().default('development'),
        MONGO_URI: Joi.required().default('mongodb://localhost:27017/tycho-db'),
        S3_FILES_BUCKET: Joi.required().default('s3.files.local'),
      }),
    }),
    MongooseModule.forRoot(environment.mongoUri),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    DonorModule,
    ConsumerModule,
    CallModule,
    LoginModule,
    NotificationsModule,
    DonorDatasetModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
