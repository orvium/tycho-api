import { ContactPerson, Data, Institution } from 'src/entities/call.entity';

export class CreateCallDto {
  readonly date: Date;
  readonly title: string;
  readonly description: string;
  readonly institution: Institution;
  readonly contactPerson: ContactPerson;
  readonly data: Data;
  readonly donors: string[] = [];
  readonly consumers: string[] = [];
}
