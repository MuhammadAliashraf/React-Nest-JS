import { Module } from '@nestjs/common';
import { CoreBackendKernelsAuthController } from './core-backend-kernels-auth.controller';
import { CoreBackendKernelsAuthService } from './core-backend-kernels-auth.service';
import { CoreBackendUtilsServicesModule } from '@utils/services';
import {
  Users,
  INDEX_POS_ADMIN_CONN,
  CoreBackendUtilsDatabasesModule,
} from '@databases/databases.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guard';
import { CoreBackendKernelsUserModule } from '@kernels/user';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '10h',
        },
      }),
    }),
    CoreBackendUtilsDatabasesModule,
    CoreBackendUtilsServicesModule,
    TypeOrmModule.forFeature([Users], INDEX_POS_ADMIN_CONN),
    CoreBackendKernelsUserModule,
  ],
  controllers: [CoreBackendKernelsAuthController],
  providers: [
    CoreBackendKernelsAuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [CoreBackendKernelsAuthService],
})
export class CoreBackendKernelsAuthModule {}
