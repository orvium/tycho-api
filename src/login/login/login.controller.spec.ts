import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        { provide: LoginService, useValue: {}}
      ]
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
