import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from '../entities/call.entity';
import { Donor, DonorSchema } from '../entities/donor.entity';
import { NotificationSchema, Notification } from '../entities/notification.entity';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Call.name,
        schema: CallSchema
      },
      {
        name: Donor.name,
        schema: DonorSchema
      },
      {
        name: Notification.name,
        schema: NotificationSchema
      }
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
