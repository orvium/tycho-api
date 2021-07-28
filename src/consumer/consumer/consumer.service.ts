import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, NativeError } from 'mongoose';
import { CreateConsumerDto } from 'src/dtos/consumer/create-consumer.dto';
import { UpdateConsumerDto } from 'src/dtos/consumer/update-consumer.dto';
import { Call } from 'src/entities/call.entity';
import { Consumer } from 'src/entities/consumer.entity';
import { CallDateInfo, Donor } from 'src/entities/donor.entity';

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

  async getMyCalls(consulerId: string) {
    if (!consulerId.match(/^[0-9a-fA-F]{24}$/)) return;

    const consumer = await this.consumerModel.findById({ _id: consulerId }).exec();

    let myCalls = await this.callModel
      .find()
      .where('_id')
      .in(consumer.calls)
      .exec();

    if (!consumer) throw new NotFoundException(`Consumer ${ consulerId } not found`);

    return myCalls;
  }

  async getMyDonors(consulerId: string) {
    if (!consulerId.match(/^[0-9a-fA-F]{24}$/)) return;

    const consumer = await this.consumerModel.findById({ _id: consulerId }).exec();

    let myCalls = await this.callModel
      .find()
      .where('_id')
      .in(consumer.calls)
      .exec();

    let donorIds = [].concat.apply([], myCalls.map((call: Call) => call.donors))

    let myDonors = await this.donorModel
      .find()
      .where('_id')
      .in(donorIds)
      .exec();

    let result = [];

    myCalls.forEach((call: Call, index: number) => {
      call.donors.forEach((donorId: string) => {
        let findDonor = myDonors.find((donor) => donor.id === donorId);
        let joinDate = findDonor.calls.find(
          (callInfo: CallDateInfo) => callInfo.callId === call.id
        )

        result.push({
          callTitle: call.title,
          callDate: joinDate.date,
          donor: `${ findDonor.name } ${ findDonor.surname }`
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
