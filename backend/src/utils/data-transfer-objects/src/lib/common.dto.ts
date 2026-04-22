import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class PartialBaseDto {
  @ApiProperty({ type: Boolean, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ type: Boolean, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;
}

export class BaseDto extends PartialBaseDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  updatedAt: Date;
}

export class ResponseDto<T> {
  @ApiProperty({ type: Number })
  code: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Object, nullable: true })
  data?: T | T[] | null;
}
