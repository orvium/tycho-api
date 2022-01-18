import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsStorageService } from '../../common/aws-storage/aws-storage.service';
import { CallService } from './call.service';

describe('CallService', () => {
  let service: CallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CallService,
        { provide: AwsStorageService, useValue: {} },
        { provide: 'CallModel', useValue: {} },
        { provide: 'ConsumerModel', useValue: {} },
        { provide: 'DonorModel', useValue: {} },
        { provide: EventEmitter2, useValue: {} }
      ],
    }).compile();

    service = module.get<CallService>(CallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
