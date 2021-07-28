import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';

export class CallDateInfo {
  callId: string;
  date: Date
}

@Schema()
export class Donor extends User {
  @Prop() surname: string;

  @Prop() institution: string;

  @Prop([CallDateInfo]) calls: CallDateInfo[];
}

export const DonorSchema = SchemaFactory.createForClass(Donor);
