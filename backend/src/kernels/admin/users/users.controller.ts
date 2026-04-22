import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from '@utils/data-transfer-objects';

@Controller('admin/users')
@ApiTags('Admin - Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, type: [UserDto] })
  async getAll(
    @Query('limit') limitRaw?: string | number,
    @Query('offset') offsetRaw?: string | number,
    @Query('search') search?: string,
  ) {
    let limit = 10;
    if (limitRaw !== undefined && limitRaw !== '') {
      const parsed = parseInt(limitRaw.toString(), 10);
      if (!isNaN(parsed)) limit = parsed;
    }

    let offset = 0;
    if (offsetRaw !== undefined && offsetRaw !== '') {
      const parsed = parseInt(offsetRaw.toString(), 10);
      if (!isNaN(parsed)) offset = parsed;
    }

    const [data, total] = await this.usersService.findAll(
      limit,
      offset,
      search,
    );
    return { data, total };
  }

  @Get('/:id')
  @ApiResponse({ status: 200, type: UserDto })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.usersService.findOne(id);
    user.password = ''; // Ensure password is not returned
    return user as UserDto;
  }

  @Post()
  @ApiResponse({ status: 201, type: Object })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: UserDto }> {
    const { jwtToken, user } = await this.usersService.register(createUserDto);
    return { token: jwtToken, user: user as UserDto };
  }

  @Get('check-availability')
  @ApiResponse({ status: 200, type: Boolean })
  async checkAvailability(
    @Query('email') email: string,
    @Query('excludeId') excludeId?: number,
  ): Promise<boolean> {
    return await this.usersService.checkAvailability(email, excludeId);
  }

  @Put('/:id')
  @ApiResponse({ status: 200, type: UserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.update(id, updateDto);
    user.password = '';
    return user as UserDto;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204 })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }

  @Get(':id/logs')
  @ApiResponse({ status: 200, type: [Object] })
  async getLogs(): Promise<any[]> {
    // Placeholder for future implementation
    return [];
  }
}
