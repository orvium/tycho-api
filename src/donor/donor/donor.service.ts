import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateDonorDto } from '../../dtos/donor/create-donor.dto';
import { UpdateDonorDto } from '../../dtos/donor/update-donor.dto';
import { Call } from '../../entities/call.entity';
import { CallDateInfo, Donor } from '../../entities/donor.entity';

@Injectable()
export class DonorService {
  constructor(
    @InjectModel(Donor.name) private readonly donorModel: Model<Donor>,
    @InjectModel(Call.name) private readonly callModel: Model<Call>
  ) {}

  getAll() {
    return this.donorModel.find().exec();
  }

  async getAllWithoutMe(donorId: string, query?: string) {
    if (!donorId.match(/^[0-9a-fA-F]{24}$/)) return;

    const filter: FilterQuery<Call> = {};
    filter.$and = [{ donors: { $ne: donorId } }];

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { keywords: { $in: [ query ] } }
      ];
    }

    return await this.callModel.find(filter).exec();
  }

  async getOne(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const donor = await this.donorModel.findById({ _id: id }).exec();

    if (!donor) throw new NotFoundException(`Donor ${id} not found`);

    return donor;
  }

  async getMyCalls(donorId: string, query?: string) {
    if (!donorId.match(/^[0-9a-fA-F]{24}$/)) return;

    const donor = await this.donorModel.findById({ _id: donorId }).exec();

    const ids = donor.calls.map((callInfo: CallDateInfo) => callInfo.callId)

    const filter: FilterQuery<Call> = {};
    filter.$and = [{ _id: { $in: ids } }];

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { keywords: { $in: [ query ] } }
      ];
    }

    return await this.callModel.find(filter).exec();
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
