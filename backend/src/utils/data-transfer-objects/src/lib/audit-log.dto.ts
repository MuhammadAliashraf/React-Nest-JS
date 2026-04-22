import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './common.dto';

export class AuditLogDto extends BaseDto {
  @ApiProperty({ type: Number, nullable: true })
  userId: number | null;

  @ApiProperty({ type: String, nullable: true })
  userName: string | null;

  @ApiProperty({ type: String })
  action: string;

  @ApiProperty({ type: String })
  module: string;

  @ApiProperty({ type: String, nullable: true })
  description: string | null;

  @ApiProperty({ type: Object, nullable: true })
  metadata: any | null;

  @ApiProperty({ type: String, nullable: true })
  ipAddress: string | null;

  @ApiProperty({ type: String, nullable: true })
  userAgent: string | null;
}

export class CreateAuditLogDto {
  @ApiProperty({ type: Number, nullable: true })
  userId?: number | null;

  @ApiProperty({ type: String, nullable: true })
  userName?: string | null;

  @ApiProperty({ type: String })
  action: string;

  @ApiProperty({ type: String })
  module: string;

  @ApiProperty({ type: String, nullable: true })
  description?: string | null;

  @ApiProperty({ type: Object, nullable: true })
  metadata?: any | null;

  @ApiProperty({ type: String, nullable: true })
  ipAddress?: string | null;

  @ApiProperty({ type: String, nullable: true })
  userAgent?: string | null;
}
