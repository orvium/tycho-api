import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDonorDto } from 'src/dtos/donor/create-donor.dto';
import { UpdateDonorDto } from 'src/dtos/donor/update-donor.dto';
import { DonorService } from './donor.service';

@ApiTags('donor')
@Controller('donor')
export class DonorController {
  constructor(private donorService: DonorService) {}

   /**
    * Get all donors
    */
  @Get()
  getAll() {
    return this.donorService.getAll();
  }

  /**
   * Get all calls without particular donor
   */
  @Get(':id/without-me')
  getAllWithoutMe(@Param('id') donorId: string) {
    return this.donorService.getAllWithoutMe(donorId);
  }

  /**
   * Get one donor
   */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.donorService.getOne(id);
  }

  /**
   * Get donor's calls
   */
  @Get(':id/my-calls')
  getMyCalls(@Param('id') donorId: string) {
    return this.donorService.getMyCalls(donorId);
  }

  /**
   * Create new donor
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDonorDto: CreateDonorDto) {
    return this.donorService.create(createDonorDto);
  }

  /**
   * Update donor
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonorDto: UpdateDonorDto) {
    return this.donorService.update(id, updateDonorDto);
  }

  /**
   * Delete donor
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.donorService.delete(id) ;
  }
}
