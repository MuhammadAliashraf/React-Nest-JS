import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EmailNotificationDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsOptional()
  from: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  to: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsOptional()
  subject: string;

  @ApiProperty({ type: String, required: true }) // Changed to String
  @IsString() // Updated to IsString to match the text field type
  text: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  html: string;

  @ApiProperty({ type: [Object], required: false })
  @IsOptional()
  attachments?: {
    filename: string;
    content: Buffer | string; // Buffer or Base64 string
    contentType?: string;
    encoding?: string; // e.g., 'base64' if base64 string
  }[];

  @ApiProperty({ type: [Object], required: false })
  @IsOptional()
  data?: {
    purchaseOrderId: string;
    grnId: string;
    returnGrnId: string;
    createdAt: Date;
  };
}
