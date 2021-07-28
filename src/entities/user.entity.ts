import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum USER_ROLE {
  consumer = 'consumer',
  donor = 'donor',
}

@Schema()
export class User extends Document {
  @Prop() name: string;

  @Prop({ enum: Object.values(USER_ROLE) }) role: USER_ROLE;

  @Prop() email: string;

  @Prop() password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
