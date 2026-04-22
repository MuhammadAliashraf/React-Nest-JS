import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SystemSettingsDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  key: string;

  @ApiProperty({ type: String })
  value: string;

  @ApiProperty({ type: String })
  group: string;

  @ApiProperty({ type: String, nullable: true })
  description: string | null;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class CreateSystemSettingsDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateSystemSettingsDto extends PartialType(
  CreateSystemSettingsDto,
) {}
