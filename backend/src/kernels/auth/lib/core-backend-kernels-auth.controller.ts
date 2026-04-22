import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CoreBackendKernelsAuthService } from './core-backend-kernels-auth.service';
import { Public } from '@utils/api-decorators';
import {
  CreateUserDto,
  UserDto,
  LoginDto,
  ForgotPasswordDto,
  UpdatePasswordDto,
  PayloadDto,
} from '@utils/data-transfer-objects';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class CoreBackendKernelsAuthController {
  constructor(private authService: CoreBackendKernelsAuthService) {}

  @Public()
  @Post('check-email')
  async checkEmail(@Body('email') email: string) {
    const user = await this.authService.findUserByEmail(email);
    return { exists: !!user };
  }

  @Public()
  @ApiResponse({ status: 200, type: Object })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    token: string;
    user: UserDto;
  }> {
    const { jwtToken, user: _user } = await this.authService.register(
      createUserDto,
    );

    return { token: jwtToken, user: _user };
  }

  @Public()
  @ApiResponse({ status: 200, type: Object })
  @Post('login')
  async login(@Body() model: LoginDto) {
    const { token, user, roles, permissions } = await this.authService.login(
      model.email,
      model.password,
    );

    return { token, user, roles, permissions };
  }

  @Public()
  @ApiResponse({ status: 200, type: String })
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    const resetToken = await this.authService.forgotPassword(email);
    return { resetToken }; // For testing purposes, normally you wouldn't return this
  }

  @Public()
  @ApiResponse({ status: 200, type: Object })
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: UpdatePasswordDto,
  ) {
    const { password } = body;
    const _user = await this.authService.resetPassword(token, password);
    return { message: 'Password reset successful' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: UserDto })
  @Get('profile')
  async profile(
    @Request() req: { user: PayloadDto },
  ): Promise<PayloadDto | null> {
    return this.authService.findUserById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: Object })
  @Put('change-password')
  async changePassword(
    @Request() req: { user: PayloadDto },
    @Body() body: any,
  ) {
    const { currentPassword, newPassword } = body;
    await this.authService.changePassword(
      req.user.userId,
      currentPassword,
      newPassword,
    );
    return { message: 'Password changed successfully' };
  }
}
