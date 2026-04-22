import { Test } from '@nestjs/testing';
import { CoreBackendKernelsAuthService } from './core-backend-kernels-auth.service';

describe('CoreBackendKernelsAuthService', () => {
  let service: CoreBackendKernelsAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CoreBackendKernelsAuthService],
    }).compile();

    service = module.get(CoreBackendKernelsAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
