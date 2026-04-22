import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { CoreBackendUtilsDatabasesModule } from '@databases/databases.module';
import { LoggerMiddleware } from '@utils/middlewares';
import { GlobalExceptionFilter } from '@utils/filters';
import { CoreBackendKernelsAuthModule } from './kernels/auth/lib/core-backend-kernels-auth.module';
import { CoreBackendKernelsUserModule } from './kernels/user/lib/core-backend-kernels-user.module';
import { UploadModule } from './kernels/upload/upload.module';

import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './utils/health/health.module';
import { AdminUsersModule } from './kernels/admin/users/admin-users.module';

const KernelsModule = [
  CoreBackendKernelsAuthModule,
  CoreBackendKernelsUserModule,
  UploadModule,
  AdminUsersModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Serve the local uploads folder as static files at /uploads/*
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),

    CoreBackendUtilsDatabasesModule,
    ...KernelsModule,

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.POST });
  }
}
