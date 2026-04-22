import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    description: 'Email',
    example: 'test@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'Password', example: '123456' })
  password: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'Password',
    example: '123456',
  })
  password!: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    description: 'Email',
    example: 'test@gmail.com',
  })
  email!: string;
}
