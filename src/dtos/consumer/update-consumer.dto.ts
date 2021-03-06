import { USER_ROLE } from '../../entities/user.entity';

export class UpdateConsumerDto {
  readonly name?: string;
  readonly role?: USER_ROLE;
  readonly email?: string;
  readonly password?: string;
  readonly isPrivate?: boolean;
  readonly consumerType?: string;
  readonly location?: string;
  readonly website?: string;
  readonly department?: string;
  readonly description?: string;
  readonly calls?: string[];
}
