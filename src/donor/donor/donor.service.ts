import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDonorDto } from 'src/dtos/donor/create-donor.dto';
import { UpdateDonorDto } from 'src/dtos/donor/update-donor.dto';
import { Call } from 'src/entities/call.entity';
import { CallDateInfo, Donor } from 'src/entities/donor.entity';

@Injectable()
export class DonorService {
  constructor(
    @InjectModel(Donor.name) private readonly donorModel: Model<Donor>,
    @InjectModel(Call.name) private readonly callModel: Model<Call>
  ) {}

  getAll() {
    return this.donorModel.find().exec();
  }

  async getAllWithoutMe(donorId: string) {
    if (!donorId.match(/^[0-9a-fA-F]{24}$/)) return;

    let calls = await this.callModel.find({
      'donors': { $ne: donorId }
    }).exec();

    return calls;
  }

  async getOne(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const donor = await this.donorModel.findById({ _id: id }).exec();

    if (!donor) throw new NotFoundException(`Donor ${id} not found`);

    return donor;
  }

  async getMyCalls(donorId: string) {
    if (!donorId.match(/^[0-9a-fA-F]{24}$/)) return;

    const donor = await this.donorModel.findById({ _id: donorId }).exec();

    let ids = donor.calls.map((callInfo: CallDateInfo) => callInfo.callId)

    let myCalls = await this.callModel
      .find()
      .where('_id')
      .in(ids)
      .exec();

    return myCalls;
  }

  create(createDonorDto: CreateDonorDto) {
    const donor = new this.donorModel(createDonorDto);

    return donor.save();
  }

  async update(id: string, updateDonorDto: UpdateDonorDto) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const existingDonor = await this.donorModel
      .findOneAndUpdate({ _id: id }, { $set: updateDonorDto }, { new: true })
      .exec();

    if (!existingDonor) {
      throw new NotFoundException(`Donor #${id} not found`);
    }

    return existingDonor;
  }

  async delete(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const donor = await this.getOne(id);

    return donor.delete();
  }
}
