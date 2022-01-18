import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDatasetDto } from '../../dtos/dataset/create-dataset.dto';
import { Dataset } from '../../entities/dataset.entity';
import { DonorDatasetService } from './donor-dataset.service';

@ApiTags('donor-dataset')
@Controller('donor-dataset')
export class DonorDatasetController {
  constructor(private donorDatasetService: DonorDatasetService) {}

  /**
   * Get all datasets
   */
  @Get()
  getAll(
    @Query('query') query?: string,
    @Query('tags') tags?: string
  ) {
    return this.donorDatasetService.getAll(query, tags);
  }

  /**
   * Get all tags
   */
  @Get('tags')
  getTags() {
    return this.donorDatasetService.getTags();
  }

  /**
   * Get donor's datasets
   */
  @Get('donor/:donorId/:callId')
  getDonorDatasets(
    @Param('donorId') donorId: string,
    @Param('callId') callId: string
  ) {
    return this.donorDatasetService.getDonorDatasets(donorId, callId);
  }

  /**
   * Get call's datasets
   */
  @Get('call/:callId')
  getCallDatasets(@Param('callId') callId: string) {
    return this.donorDatasetService.getCallDatasets(callId);
  }

  /**
   * Get one dataset
   */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.donorDatasetService.getOne(id);
  }

  /**
   * Upload file
   */
  @Post(':id/file')
  uploadFile(
    @Param('id') id: string,
    @Body() payload: { dataset: CreateDatasetDto },
  ): Promise<Dataset> {
    return this.donorDatasetService.uploadFile(id, payload);
  }
}
