import { ProfileService } from './profile.service';
import { INDEX_POS_ADMIN_CONN, Users } from '@databases/databases.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateUserDto,
  UserDto,
  UpdateUserDto,
} from '@utils/data-transfer-objects';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    @InjectRepository(Users, INDEX_POS_ADMIN_CONN)
    private repo: Repository<Users>,
  ) {}

  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  @Get()
  async getProfiles(): Promise<UserDto[]> {
    return await this.repo.find();
  }

  @ApiResponse({ status: 200, type: UserDto })
  @Get('/:id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto | null> {
    return await this.repo.findOne({ where: { id } });
  }

  @Post('images')
  @ApiResponse({ status: 200 })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const res = await this.profileService.uploadFile(
      file.originalname,
      file.buffer,
    );
    return { message: 'File uploaded successfully', imageUrl: res };
  }

  @Post()
  @ApiResponse({ status: 200, type: UserDto })
  async create(@Body() createDto: CreateUserDto): Promise<UserDto> {
    const result = await this.repo.save(createDto);

    if (!result)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    return result as UserDto;
  }

  @Put('/:id')
  @ApiResponse({ status: 200, type: UserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserDto> {
    await this.repo.update(id, updateDto);
    const updatedUser = await this.repo.findOne({ where: { id } });

    if (!updatedUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    return updatedUser as UserDto;
  }
}
