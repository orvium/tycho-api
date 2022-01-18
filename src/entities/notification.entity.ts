import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop() userId: string;
  @Prop() title: string;
  @Prop() body: string;
  @Prop() createdOn: Date;
  @Prop() isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
