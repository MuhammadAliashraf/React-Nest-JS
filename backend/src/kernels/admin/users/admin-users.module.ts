import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController as AdminUsersController } from './users.controller';
import { AuditLogController } from './audit-log.controller';
import { SystemSettingsController } from './system-settings.controller';
import { UsersService as AdminUsersService } from './users.service';
import { Users } from '@databases/databases.module';
import { INDEX_POS_ADMIN_CONN } from '@databases/databases.module';
import { CoreBackendKernelsAuthModule } from '../../auth/lib/core-backend-kernels-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users], INDEX_POS_ADMIN_CONN),
    CoreBackendKernelsAuthModule,
  ],
  controllers: [
    AdminUsersController,
    AuditLogController,
    SystemSettingsController,
  ],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminUsersModule {}
