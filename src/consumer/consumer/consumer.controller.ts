import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateConsumerDto } from '../../dtos/consumer/create-consumer.dto';
import { UpdateConsumerDto } from '../../dtos/consumer/update-consumer.dto';
import { ConsumerService } from './consumer.service';

@ApiTags('consumer')
@Controller('consumer')
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  /**
   * Get all consumers
   */
  @Get()
  getAll() {
    return this.consumerService.getAll();
  }

  /**
   * Get one consumer
   */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.consumerService.getOne(id);
  }

  /**
   * Get consumer's calls
   */
  @Get(':id/my-calls')
  getMyCalls(
    @Param('id') consumerId: string,
    @Query('query') query: string,
  ) {
    return this.consumerService.getMyCalls(consumerId, query);
  }

  /**
   * Get consumer's donors
   */
  @Get(':id/my-donors')
  getMyDonors(@Param('id') consumerId: string) {
    return this.consumerService.getMyDonors(consumerId);
  }

  /**
   * Create consumer
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createConsumerDto: CreateConsumerDto) {
    return this.consumerService.create(createConsumerDto);
  }

  /**
   * Update consumer
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsumerDto: UpdateConsumerDto) {
    return this.consumerService.update(id, updateConsumerDto);
  }

  /**
   * Delete consumer
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.consumerService.delete(id) ;
  }
}
