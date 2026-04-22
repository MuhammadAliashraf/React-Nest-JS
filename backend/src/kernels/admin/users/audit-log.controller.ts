import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuditLogService } from '@utils/services';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../kernels/auth/lib/jwt.guard';
import { AuditLogDto } from '@utils/data-transfer-objects';

@ApiTags('System - Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiResponse({ status: 200, type: [AuditLogDto] })
  async findAll(
    @Query('limit') limitRaw?: string | number,
    @Query('offset') offsetRaw?: string | number,
  ) {
    let limit = 100;
    if (limitRaw !== undefined && limitRaw !== '') {
      const parsed = parseInt(limitRaw.toString(), 10);
      if (!isNaN(parsed)) limit = parsed;
    }
    let offset = 0;
    if (offsetRaw !== undefined && offsetRaw !== '') {
      const parsed = parseInt(offsetRaw.toString(), 10);
      if (!isNaN(parsed)) offset = parsed;
    }
    const [data, total] = await this.auditLogService.findAll(limit, offset);
    return { data, total };
  }

  @Get('user/:userId')
  @ApiResponse({ status: 200, type: [AuditLogDto] })
  async findByUserId(@Query('userId', ParseIntPipe) userId: number) {
    return await this.auditLogService.findByUserId(userId);
  }
}
