import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';

@Schema()
export class Consumer extends User {
  @Prop() isPrivate: boolean;

  @Prop() consumerType: string;

  @Prop() location: string;

  @Prop() website: string;

  @Prop() department: string;

  @Prop() description: string;

  @Prop([String]) calls: string[];

}

export const ConsumerSchema = SchemaFactory.createForClass(Consumer);
