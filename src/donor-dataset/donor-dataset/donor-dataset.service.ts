import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateDatasetDto } from '../../dtos/dataset/create-dataset.dto';
import { Call } from '../../entities/call.entity';
import { Dataset, FileMetadata } from '../../entities/dataset.entity';
import { Donor } from '../../entities/donor.entity';
import { extname } from 'path';
import { removeSpecialCharacters } from '../../utils/utils';
import { environment } from '../../environments/environment';
import { AwsStorageService } from '../../common/aws-storage/aws-storage.service';

const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.jpeg', '.jpg', '.png', '.gif', '.md', '.csv', '.tex', '.rtf', '.epub'];
const TAGS = ['Education', 'Medicine', 'Computer Science'];

export interface DatasetPopulated extends Omit<Dataset, 'owner'> {
  owner: Donor,
}

@Injectable()
export class DonorDatasetService {
  constructor(
    @InjectModel(Donor.name) private readonly donorModel: Model<Donor>,
    @InjectModel(Call.name) private readonly callModel: Model<Call>,
    @InjectModel(Dataset.name) private readonly datasetModel: Model<Dataset>,
    private storageService: AwsStorageService,
  ) {}

  async getAll(query?: string, tags?: string): Promise<DatasetPopulated[]> {
    const filter: FilterQuery<Dataset> = {};

    if (query) {
      filter.description = { $regex: query.trim(), $options: 'i' };
    }
    if (tags) {
      filter.tags = { $in: [ tags.trim() ] };
    }

    return await this.datasetModel
      .find(filter)
      .populate('owner')
      .exec() as DatasetPopulated[];
  }

  async getOne(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return;

    const dataset = await this.datasetModel.findById({ _id: id }).exec();

    if (!dataset) throw new NotFoundException(`Dataset ${id} not found`);

    return dataset;
  }

  create(createDatasetDto: CreateDatasetDto) {
    const dataset = new this.datasetModel(createDatasetDto);

    return dataset.save();
  }

  async uploadFile(id: string, payload: { dataset: CreateDatasetDto }) {
    const call = await this.callModel.findById({ _id: id }).exec();

    if (!call) throw new NotFoundException(`Call ${id} not found`);

    const file: FileMetadata = payload.dataset.file;

    // File extension to lower case
    const fileExtension = extname(file.filename).toLowerCase();
    const filename = removeSpecialCharacters(file.filename).toLowerCase();

    if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
      throw new UnauthorizedException('Invalid extension file');
    }

    const createDatasetDTO: CreateDatasetDto = {
      file: file,
      description: payload.dataset.description,
      owner: payload.dataset.owner,
      call: payload.dataset.call,
      tags: payload.dataset.tags
    }

    const createdDataset: Dataset = await this.datasetModel.create(createDatasetDTO);

    const objectKey = `datasets/${createdDataset._id}/${filename}`;

    const params = {
      Bucket: environment.aws.s3.bucket,
      Key: objectKey,
      ContentType: file.contentType
    };
    const signedUrl = this.storageService.getSignedUrl('putObject', params);

    createdDataset.file.url = signedUrl;
    createdDataset.markModified('file.url');

    return await createdDataset.save();
  }

  async getDonorDatasets(donorId: string, callId: string) {
    if (!donorId.match(/^[0-9a-fA-F]{24}$/)) return;
  
    const donor = await this.donorModel.findById({ _id: donorId }).exec();

    if (!donor) throw new NotFoundException(`Donor ${ donorId } not found`);

    const filter: FilterQuery<Dataset> = {};
    filter.$and = [
      { owner: { $eq: donorId } },
      { call: { $eq: callId } }
    ];

    return await this.datasetModel.find(filter).exec();
  }

  async getCallDatasets(callId: string) {
    if (!callId.match(/^[0-9a-fA-F]{24}$/)) return;
  
    return await this.datasetModel.find().where('call').equals(callId).exec();
  }

  getTags() {
    return TAGS;
  }
}
