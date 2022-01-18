import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  /**
    * Get user's notifications
    */
  @Get(':id')
  getNotifications(@Param('id') userId: string) {
    return this.notificationService.getNotifications(userId);
  }

  /**
   * Read notification
   */
  @Post(':id/read')
  markAsRead(@Param('id') notificationId: string) {
    return this.notificationService.markAsRead(notificationId);
  }

  /**
   * Delete notification
   */
  @Delete(':userId/remove/:notificationId')
  removeNotification(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string
  ) {
    return this.notificationService.removeNotofication(userId, notificationId);
  }
}
