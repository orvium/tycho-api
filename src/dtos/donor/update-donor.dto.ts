import { CallDateInfo } from 'src/entities/donor.entity';
import { USER_ROLE } from 'src/entities/user.entity';

export class UpdateDonorDto {
  readonly name?: string;
  readonly surname?: string;
  readonly role?: USER_ROLE;
  readonly email?: string;
  readonly password?: string;
  readonly institution?: string;
  readonly calls?: CallDateInfo[];
}
