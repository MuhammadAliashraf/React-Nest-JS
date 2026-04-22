import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { CoreBackendUtilsDatabasesModule } from '@databases/databases.module';

@Module({
  imports: [TerminusModule, HttpModule, CoreBackendUtilsDatabasesModule],
  controllers: [HealthController],
})
export class HealthModule {}
