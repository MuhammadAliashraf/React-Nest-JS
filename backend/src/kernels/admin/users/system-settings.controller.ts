import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SystemSettingsService } from '@utils/services';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../kernels/auth/lib/jwt.guard';
import {
  SystemSettingsDto,
  CreateSystemSettingsDto,
  UpdateSystemSettingsDto,
} from '@utils/data-transfer-objects';
import { Public } from '@utils/api-decorators';

@ApiTags('System - Settings')
@ApiBearerAuth()
@Controller('system/settings')
export class SystemSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

  @Public()
  @Get()
  @ApiResponse({ status: 200 })
  async findAll() {
    const all = await this.settingsService.findAll();
    return this.settingsService.toMap(all);
  }

  @Public()
  @Get(':key')
  @ApiResponse({ status: 200, type: SystemSettingsDto })
  async findOne(@Param('key') key: string) {
    return await this.settingsService.findByKey(key);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, type: SystemSettingsDto })
  async create(@Body() createDto: CreateSystemSettingsDto) {
    return await this.settingsService.create(createDto);
  }

  /** Bulk upsert — accepts { appName: '...', appEmail: '...' } etc */
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({ status: 200 })
  async updateBulk(@Body() data: Record<string, string>) {
    return await this.settingsService.upsertBulk(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':key')
  @ApiResponse({ status: 200, type: SystemSettingsDto })
  async update(
    @Param('key') key: string,
    @Body() updateDto: UpdateSystemSettingsDto,
  ) {
    return await this.settingsService.update(key, updateDto);
  }
}
