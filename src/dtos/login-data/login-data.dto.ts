import { USER_ROLE } from 'src/entities/user.entity';

export class LoginDataDto {
  readonly role?: USER_ROLE;
  readonly email?: string;
  readonly password?: string;
}
