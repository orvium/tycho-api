import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCallDto } from 'src/dtos/call/create-call.dto';
import { UpdateCallDto } from 'src/dtos/call/update-call.dto';
import { Call } from 'src/entities/call.entity';
import { Consumer } from 'src/entities/consumer.entity';
import { CallDateInfo, Donor } from 'src/entities/donor.entity';

@Injectable()
export class CallService {
  constructor(
    @InjectModel(Call.name) private readonly callModel: Model<Call>,
    @InjectModel(Consumer.name) private readonly consumerModel: Model<Consumer>,
    @InjectModel(Donor.name) private readonly donorModel: Model<Donor>,
  ) {}

  getAll() {
    return this.callModel.find().exec();
  }

  async getOne(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const call = await this.callModel.findById({ _id: id }).exec();

    if (!call) throw new NotFoundException(`Call ${id} not found`);

    return call;
  }

  async create(consumerId: string, call: CreateCallDto) {
    const consumer = await this.consumerModel.findById(consumerId).exec();
    const callModel = new this.callModel(call);

    callModel.consumers.push(consumerId);
    consumer.calls.push(callModel._id)

    consumer.save(callModel._id);
    return callModel.save();
  }

  async update(id: string, updateCallDto: UpdateCallDto) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const existingCall = await this.callModel
      .findOneAndUpdate({ _id: id }, { $set: updateCallDto }, { new: true })
      .exec();

    if (!existingCall) {
      throw new NotFoundException(`Call #${id} not found`);
    }
  }

  async delete(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const call = await this.getOne(id);

    return call.delete();
  }

  async joinCall(callId: string, donorId: string) {
    let callInfo = { callId, date: new Date() };

    await this.callModel.updateOne(
      { _id: callId },
      { $push: { donors: donorId } },
    )
    await this.donorModel.updateOne(
      { _id: donorId },
      { $push: { calls: callInfo } },
    );
  }

  async revokeCall(callId: string, donorId: string) {
    const donor = await this.donorModel.findById(donorId).exec();
    const call = await this.callModel.findById(callId).exec();

    let callIndex = donor.calls.findIndex((callInfo: CallDateInfo) => callInfo.callId === callId);
    donor.calls.splice(callIndex, 1);

    let donorIndex = call.donors.indexOf(callId);
    call.donors.splice(donorIndex, 1);

    donor.save();
    call.save();
  }
}
