import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateConsumerDto } from '../../dtos/consumer/create-consumer.dto';
import { UpdateConsumerDto } from '../../dtos/consumer/update-consumer.dto';
import { Call } from '../../entities/call.entity';
import { Consumer } from '../../entities/consumer.entity';
import { Donor, CallDateInfo } from '../../entities/donor.entity';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectModel(Consumer.name) private readonly consumerModel: Model<Consumer>,
    @InjectModel(Donor.name) private readonly donorModel: Model<Donor>,
    @InjectModel(Call.name) private readonly callModel: Model<Call>
  ) {}

  getAll() {
    return this.consumerModel.find().exec();
  }

  async getOne(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const consumer = await this.consumerModel.findById({ _id: id }).exec();

    if (!consumer) throw new NotFoundException(`Consumer ${id} not found`);

    return consumer;
  }

  async getMyCalls(consumerId: string, query?: string) {
    if (!consumerId.match(/^[0-9a-fA-F]{24}$/)) return;

    const consumer = await this.consumerModel.findById({ _id: consumerId }).exec();

    if (!consumer) throw new NotFoundException(`Consumer ${ consumerId } not found`);

    const filter: FilterQuery<Call> = {};
    filter.$and = [{ _id: { $in: consumer.calls } }];

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { keywords: { $in: [ query ] } }
      ];
    }

    return await this.callModel.find(filter).exec();
  }

  async getMyDonors(consumerId: string) {
    if (!consumerId.match(/^[0-9a-fA-F]{24}$/)) return;

    const consumer = await this.consumerModel.findById({ _id: consumerId }).exec();

    const myCalls = await this.callModel
      .find()
      .where('_id')
      .in(consumer.calls)
      .exec();

    const donorIds = [ ...myCalls.map((call: Call) => call.donors)];

    const myDonors = await this.donorModel
      .find()
      .where('_id')
      .in(donorIds)
      .exec();

    const result = [];

    myCalls.forEach((call: Call) => {
      call.donors.forEach((donorId: string) => {
        const findDonor = myDonors.find((donor) => donor.id === donorId);
        const joinDate = findDonor.calls.find(
          (callInfo: CallDateInfo) => callInfo.callId === call.id
        )

        result.push({
          callTitle: call.title,
          joinDate: joinDate.date,
          donorName: `${ findDonor.name } ${ findDonor.surname }`,
          donorId: findDonor.id
        })
      })
    });

    return result;
  }

  create(createConsumerDto: CreateConsumerDto) {
    const consumer = new this.consumerModel(createConsumerDto);

    return consumer.save();
  }

  async update(id: string, updateConsumerDto: UpdateConsumerDto) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const existingConsumer = await this.consumerModel
      .findOneAndUpdate({ _id: id }, { $set: updateConsumerDto }, { new: true })
      .exec();

    if (!existingConsumer) {
      throw new NotFoundException(`Consumer #${id} not found`);
    }

    return existingConsumer;
  }

  async delete(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const consumer = await this.getOne(id);

    return consumer.delete();
  }
}
