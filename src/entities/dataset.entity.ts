import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Donor } from './donor.entity';

export class FileMetadata {
  filename!: string;
  contentType!: string;
  contentLength!: number;
  url?: string;
}

@Schema()
export class Dataset extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
  })
  owner!: mongoose.Schema.Types.ObjectId | string | Donor;
  @Prop() call: string;
  @Prop() description: string;
  @Prop([String]) tags: string[];
  @Prop(FileMetadata) file: FileMetadata;
}

export const DatasetSchema = SchemaFactory.createForClass(Dataset);
