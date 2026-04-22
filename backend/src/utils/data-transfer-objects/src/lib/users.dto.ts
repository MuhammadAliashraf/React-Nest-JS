import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { BaseDto, PartialBaseDto } from './common.dto';

export class CreateUserDto extends PartialBaseDto {
  @ApiProperty({ type: String, required: true, example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true, example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Password123!',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  // @ApiProperty({ type: Number, required: true, example: 1 })
  // @IsNotEmpty()
  // roleId: number;

  @ApiProperty({ type: String, required: false, example: 'admin' })
  @IsOptional()
  @IsString()
  role?: string | null;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  resetPasswordToken: string | null;

  @ApiProperty({ type: Date, nullable: true, required: false })
  @IsOptional()
  resetPasswordExpires: Date | null;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserDto extends BaseDto {
  @ApiProperty({ type: String, required: true, example: 'USR-001' })
  userCode: string;

  @ApiProperty({ type: String, required: true, example: 'John Doe' })
  name: string;

  @ApiProperty({ type: String, required: true, example: 'john@example.com' })
  email: string;

  @ApiProperty({ type: String, required: true, example: 'admin' })
  role: string;

  @ApiProperty({ type: String, nullable: true })
  avatar: string;

  @ApiProperty({ type: String, nullable: true })
  address: string;

  @ApiProperty({ type: String, nullable: true })
  city: string;

  @ApiProperty({ type: String, nullable: true })
  zipCode: string;

  @ApiProperty({ type: String, nullable: true })
  country: string;
}
