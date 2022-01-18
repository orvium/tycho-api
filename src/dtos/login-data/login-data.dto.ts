import { USER_ROLE } from '../../entities/user.entity';

export class LoginDataDto {
  readonly role?: USER_ROLE;
  readonly email?: string;
  readonly password?: string;
}
