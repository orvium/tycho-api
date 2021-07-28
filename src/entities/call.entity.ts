import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Institution {
  name: string;
  isPrivate: boolean;
  institutionType: string;
  location: string;
  website: string;
  department: string;
  description: string;
}

export class ContactPerson {
  name: string;
  surname: string;
  email: string;
}

export class Data {
  license: string;
  thirdParties: string;
  dataTemplate: any;
  personalInformation: string;
}

@Schema()
export class Call extends Document {
  @Prop() date: Date;
  @Prop() title: string;
  @Prop() description: string;
  @Prop() institution: Institution;
  @Prop() contactPerson: ContactPerson;
  @Prop() data: Data;
  @Prop([String]) donors: string[];
  @Prop([String]) consumers: string[];
}

export const CallSchema = SchemaFactory.createForClass(Call);
