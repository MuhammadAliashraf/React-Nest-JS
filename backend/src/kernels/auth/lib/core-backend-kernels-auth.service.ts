import { CreateUserDto, PayloadDto } from '@utils/data-transfer-objects';
import { INDEX_POS_ADMIN_CONN, Users } from '@databases/databases.module';
import { comparePassword, hashPassword } from '@utils/helpers';
import { SendEmail } from '@utils/services';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import cryptoJs = require('crypto-js');
import { UserRole, RolePermissions } from './roles.config';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoreBackendKernelsAuthService {
  constructor(
    private readonly sendEmail: SendEmail,
    @InjectRepository(Users, INDEX_POS_ADMIN_CONN)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ jwtToken: string; user: Users }> {
    const hashedPassword = hashPassword(createUserDto.password);

    const user = await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    const payload = {
      username: user.email,
      sub: user.id,
    };

    const jwtToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    user.password = '';

    return { jwtToken, user };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    user: PayloadDto;
    roles: string[];
    permissions: string[];
  }> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user || !comparePassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      username: user.email,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const userPayload = {
      userCode: user.userCode,
      role: user.role,
      userId: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      counterId: 0, // Placeholder
      clientCode: null,
      clientName: null,
    } as PayloadDto;

    const roles = user.role ? [user.role] : [UserRole.SUBSCRIBER];
    const permissions =
      RolePermissions[user.role as UserRole] ||
      RolePermissions[UserRole.SUBSCRIBER];

    return { token, user: userPayload, roles, permissions };
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const resetToken = cryptoJs.lib.WordArray.random(32).toString();
    const resetTokenHash = cryptoJs.SHA256(resetToken).toString();

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    this.usersRepository.update(user.id, user);

    const resetLink = `${process.env['EMAIL_DOMAIN']}#/u/reset-password/${resetToken}`;

    await this.sendEmail.sendEmailNotifications({
      from: 'noreply@example.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use this link: ${resetLink}`,
      html: `<p>You requested a password reset.</p><p><a href="${resetLink}">Click here to reset your password</a></p>`,
    });

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: {
        resetPasswordToken: cryptoJs.SHA256(token).toString(),
      },
    });

    if (!user) throw new Error('User not found');

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error('Token has expired');
    }

    user.password = hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    this.usersRepository.update(user.id, user);

    return user;
  }

  async findUserById(userId: number): Promise<PayloadDto | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      const userRole = (user.role as UserRole) || UserRole.SUBSCRIBER;
      return <PayloadDto>{
        userCode: user.userCode,
        role: user.role,
        userId: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        roles: [userRole],
        permissions: RolePermissions[userRole] || [],
      };
    }
    return null;
  }

  async findUserByEmail(email: string): Promise<PayloadDto | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user) {
      const userRole = (user.role as UserRole) || UserRole.SUBSCRIBER;
      return <PayloadDto>{
        userCode: user.userCode,
        role: user.role,
        userId: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        roles: [userRole],
        permissions: RolePermissions[userRole] || [],
      };
    }
    return null;
  }

  async changePassword(
    userId: number,
    currentPass: string,
    newPass: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    if (!comparePassword(currentPass, user.password)) {
      throw new Error('Current password incorrect');
    }

    user.password = hashPassword(newPass);
    await this.usersRepository.update(user.id, { password: user.password });
  }
}
