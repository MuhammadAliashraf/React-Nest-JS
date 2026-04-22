import { Test } from '@nestjs/testing';
import { CoreBackendKernelsAuthController } from './core-backend-kernels-auth.controller';
import { CoreBackendKernelsAuthService } from './core-backend-kernels-auth.service';

describe('CoreBackendKernelsAuthController', () => {
  let controller: CoreBackendKernelsAuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CoreBackendKernelsAuthService],
      controllers: [CoreBackendKernelsAuthController],
    }).compile();

    controller = module.get(CoreBackendKernelsAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
