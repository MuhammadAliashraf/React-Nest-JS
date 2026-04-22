import { Controller, Get } from '@nestjs/common';
import * as path from 'path';
import { Public } from '@utils/api-decorators';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { INDEX_POS_ADMIN_CONN } from '@databases/databases.module';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}
  @Get('ping')
  ping() {
    return 'App is working!';
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { connection: INDEX_POS_ADMIN_CONN }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', {
          path: path.parse(process.cwd()).root,
          thresholdPercent: 0.9,
        }),
    ]);
  }
}
