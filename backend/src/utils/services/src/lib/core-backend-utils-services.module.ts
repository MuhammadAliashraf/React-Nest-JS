import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SendEmail } from './email.service';
import { AuditLogService } from './audit-log.service';
import { SystemSettingsService } from './system-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INDEX_POS_ADMIN_CONN, AuditLog, SystemSettings } from '@databases';

@Global()
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([AuditLog, SystemSettings], INDEX_POS_ADMIN_CONN),
  ],
  providers: [SendEmail, AuditLogService, SystemSettingsService],
  exports: [HttpModule, SendEmail, AuditLogService, SystemSettingsService],
})
export class CoreBackendUtilsServicesModule {}
