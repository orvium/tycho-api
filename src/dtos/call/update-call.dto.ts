import { Institution, ContactPerson, Data } from '../../entities/call.entity';

export class UpdateCallDto {
  readonly date?: Date;
  readonly title?: string;
  readonly description?: string;
  readonly institution?: Institution;
  readonly contactPerson?: ContactPerson;
  readonly data?: Data;
  readonly imageUrl?: string;
  readonly donors?: string[];
  readonly consumers?: string[];
  readonly keywords?: string[] = [];
}
