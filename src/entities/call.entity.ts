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
  dataTemplate: DataTemplate;
  personalInformation: string;
}

export class DataTemplate {
  filename: string;
  contentType: string;
  contentLength: number;
}

@Schema()
export class Call extends Document {
  @Prop() date: Date;
  @Prop() title: string;
  @Prop() description: string;
  @Prop() institution: Institution;
  @Prop() contactPerson: ContactPerson;
  @Prop() data: Data;
  @Prop() imageUrl: string;
  @Prop() fileUrl: string;
  @Prop([String]) donors: string[];
  @Prop([String]) consumers: string[];
  @Prop([String]) keywords: string[];
}

export const CallSchema = SchemaFactory.createForClass(Call);
