import { IS_PUBLIC_KEY } from '@utils/api-decorators';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CoreBackendKernelsAuthService } from './core-backend-kernels-auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private authService: CoreBackendKernelsAuthService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('JwtAuthGuard: No token found in header');
      throw new UnauthorizedException();
    }
    try {
      const payload: {
        username: string;
        sub: number;
        exp: number;
        iat: number;
      } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && currentTime > payload.exp) {
        console.log('JwtAuthGuard: Token expired');
        throw new UnauthorizedException('Token has expired');
      }

      const user = await this.authService.findUserById(Number(payload.sub));
      if (!user) {
        console.log(`JwtAuthGuard: User with ID ${payload.sub} not found`);
        throw new UnauthorizedException();
      }

      request['user'] = user;
    } catch (err) {
      console.log('JwtAuthGuard: Verification failed', err.message);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
