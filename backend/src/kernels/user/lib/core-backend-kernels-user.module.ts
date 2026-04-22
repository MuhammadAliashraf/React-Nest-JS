import {
  CoreBackendUtilsDatabasesModule,
  INDEX_POS_ADMIN_CONN,
  Users,
} from '@databases/databases.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

@Module({
  imports: [
    CoreBackendUtilsDatabasesModule,
    TypeOrmModule.forFeature([Users], INDEX_POS_ADMIN_CONN),
  ],
  controllers: [ProfileController, DashboardController],
  providers: [ProfileService, DashboardService],
  exports: [ProfileService, DashboardService, TypeOrmModule],
})
export class CoreBackendKernelsUserModule {}
