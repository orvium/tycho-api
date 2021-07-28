import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCallDto } from 'src/dtos/call/create-call.dto';
import { UpdateCallDto } from 'src/dtos/call/update-call.dto';
import { CallService } from './call.service';

@ApiTags('call')
@Controller('call')
export class CallController {
  constructor(private callService: CallService) {}

  /**
   * Get all calls
   */
  @Get()
  getAll() {
    return this.callService.getAll();
  }

  /**
   * Get one call
   */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.callService.getOne(id);
  }

  /**
   * Revoke call (for donor)
   */
  @Post(':id/revoke')
  revokeCall(@Param('id') callId: string, @Body() { donorId } ) {
    return this.callService.revokeCall(callId, donorId);
  }

  /**
   * Join call (for donor)
   */
  @Post(':id/join')
  joinCall(@Param('id') callId: string, @Body() { donorId } ) {
    return this.callService.joinCall(callId, donorId);
  }

  /**
   * Create new call
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: { consumerId: string, call: CreateCallDto }) {
    return this.callService.create(body.consumerId, body.call);
  }

  /**
   * Update call
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callService.update(id, updateCallDto);
  }

  /**
   * Delete call
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.callService.delete(id) ;
  }
}
