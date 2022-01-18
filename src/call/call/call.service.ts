import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { extname } from 'path';
import { AwsStorageService } from '../../common/aws-storage/aws-storage.service';
import { CreateCallDto } from '../../dtos/call/create-call.dto';
import { UpdateCallDto } from '../../dtos/call/update-call.dto';
import { Call } from '../../entities/call.entity';
import { Consumer } from '../../entities/consumer.entity';
import { Donor, CallDateInfo } from '../../entities/donor.entity';
import { environment } from '../../environments/environment';
import { removeSpecialCharacters } from '../../utils/utils';

const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.jpeg', '.jpg', '.png', '.gif', '.md', '.csv', '.tex', '.rtf', '.epub'];

class AppFile {
  readonly lastModified!: number;
  readonly name!: string;
  readonly size!: number;
  readonly type!: string;
}

@Injectable()
export class CallService {
  constructor(
    @InjectModel(Call.name) private readonly callModel: Model<Call>,
    @InjectModel(Consumer.name) private readonly consumerModel: Model<Consumer>,
    @InjectModel(Donor.name) private readonly donorModel: Model<Donor>,
    private eventEmitter: EventEmitter2,
    private storageService: AwsStorageService,
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
    const callInfo = { callId, date: new Date() };

    await this.callModel.updateOne(
      { _id: callId },
      { $push: { donors: donorId } },
    )
    await this.donorModel.updateOne(
      { _id: donorId },
      { $push: { calls: callInfo } },
    );

    this.eventEmitter.emit(
      'call.joined',
      {
        callId, donorId
      }
    )
  }

  async revokeCall(callId: string, donorId: string) {
    const donor = await this.donorModel.findById(donorId).exec();
    const call = await this.callModel.findById(callId).exec();

    const callIndex = donor.calls.findIndex((callInfo: CallDateInfo) => callInfo.callId === callId);
    donor.calls.splice(callIndex, 1);

    const donorIndex = call.donors.indexOf(callId);
    call.donors.splice(donorIndex, 1);

    donor.save();
    call.save();

    this.eventEmitter.emit(
      'call.revoked',
      {
        callId, donorId
      }
    )
  }

  async uploadFile(id: string, payload: { file: AppFile }) {
    const call = await this.callModel.findById({ _id: id }).exec();

    if (!call) throw new NotFoundException(`Call ${id} not found`);

    const file = payload.file;

    // File extension to lower case
    const fileExtension = extname(file.name).toLowerCase();
    const filename = removeSpecialCharacters(file.name).toLowerCase();

    if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
      throw new UnauthorizedException('Invalid extension file');
    }

    const fileMetadata: any = {
      filename: filename,
      contentType: file.type,
      contentLength: file.size,
    };

    if (call.data.dataTemplate) {
      const previousObjectKey = `${call._id}/${call.data.dataTemplate.filename}`;
      await this.storageService.delete(previousObjectKey);
    }

    call.data.dataTemplate = fileMetadata;

    const objectKey = `${call._id}/${filename}`;

    const params = {
      Bucket: environment.aws.s3.bucket,
      Key: objectKey,
      ContentType: fileMetadata.contentType
    };
    const signedUrl = this.storageService.getSignedUrl('putObject', params);

    call.fileUrl = signedUrl;
    call.save();

    return { signedUrl, call };
  }

  async getCallDonors(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const call = await this.callModel.findById({ _id: id }).exec();

    if (!call) throw new NotFoundException(`Call ${id} not found`);

    const donors = await this.donorModel
      .find()
      .where('_id')
      .in(call.donors)
      .exec();

    return donors;
  }
}
