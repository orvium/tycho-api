export class UpdateNotificationDto {
  readonly userId?: string;
  readonly title?: string;
  readonly body?: string;
  readonly createdOn?: Date;
  readonly isRead?: boolean;
}
