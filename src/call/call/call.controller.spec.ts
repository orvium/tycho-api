import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsStorageService } from '../../common/aws-storage/aws-storage.service';
import { CallController } from './call.controller';
import { CallService } from './call.service';

describe('CallController', () => {
  let controller: CallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallController],
      providers: [
        { provide: AwsStorageService, useValue: {} },
        { provide: 'ConsumerModel', useValue: {} },
        { provide: 'DonorModel', useValue: {} },
        { provide: EventEmitter2, useValue: {} },
        { provide: CallService, useValue: {} }
      ]
    }).compile();

    controller = module.get<CallController>(CallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
