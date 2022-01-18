import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from '../../dtos/notification/create-notification.dto';
import { Call } from '../../entities/call.entity';
import { Donor } from '../../entities/donor.entity';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
    @InjectModel(Donor.name) private readonly donorModel: Model<Donor>,
    @InjectModel(Call.name) private readonly callModel: Model<Call>
  ) {}

  @OnEvent('call.joined')
  async handleCallJoinedEvent(payload: { callId: string, donorId: string }) {
    const call = await this.callModel.findById({ _id: payload.callId }).exec();
    const donor = await this.donorModel.findById({ _id: payload.donorId }).exec();

    this.create({
      userId: call.consumers[0],
      title: `${donor.name} ${donor.surname} joined call '${call.title}'`,
      body: '',
      createdOn: new Date(),
      isRead: false
    });
  }

  @OnEvent('call.revoked')
  async handleCallRevokedEvent(payload: { callId: string, donorId: string }) {
    const call = await this.callModel.findById({ _id: payload.callId }).exec();
    const donor = await this.donorModel.findById({ _id: payload.donorId }).exec();

    this.create({
      userId: call.consumers[0],
      title: `${donor.name} ${donor.surname} revoked call '${call.title}'`,
      body: '',
      createdOn: new Date(),
      isRead: false
    });
  }

  create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createNotificationDto);

    return notification.save();
  }

  async getNotifications(userId: string) {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) return;

    const notifications = await this.notificationModel.find({userId}).exec();

    if (!notifications) throw new NotFoundException(`No notifications`);

    return notifications;
  }

  async removeNotofication(userId: string, notificationId: string) {
    if (!notificationId.match(/^[0-9a-fA-F]{24}$/)) return;

    const notification = await this.getOne(notificationId);

    await notification.delete();

    return await this.getNotifications(userId);
  }

  async markAsRead(notificationId: string) {
    if (!notificationId.match(/^[0-9a-fA-F]{24}$/)) return;

    const notification = await this.getOne(notificationId);

    notification.isRead = true;

    return notification.save();
  }

  async getOne(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const notification = await this.notificationModel.findById({ _id: id }).exec();

    if (!notification) throw new NotFoundException(`Notification ${id} not found`);

    return notification;
  }
}
