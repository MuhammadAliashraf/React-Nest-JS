import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadService } from './upload.service';
import { CloudinaryService } from './cloudinary.service';

import { Public } from '@utils/api-decorators';

const imageFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
    return cb(
      new BadRequestException(
        'Only image files are allowed (jpg, png, gif, webp, svg).',
      ),
      false,
    );
  }
  cb(null, true);
};

const videoFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file.mimetype.match(/^video\/(mp4|mpeg|quicktime|x-msvideo|webm)$/)) {
    return cb(
      new BadRequestException(
        'Only video files are allowed (mp4, mpeg, webm, mov, avi).',
      ),
      false,
    );
  }
  cb(null, true);
};

const storage = diskStorage({
  destination: UploadService.uploadDir,
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * POST /upload/image
   * Accepts a single image file (form-data field: "file").
   * Returns { url } — the public URL to reference in product records.
   *
   * When switching to S3/Cloudinary, only UploadService.getFileUrl() changes.
   */
  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Returns { url: string }' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded.');
    const url = this.uploadService.getFileUrl(file.filename);
    return {
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }

  /**
   * POST /upload/cloudinary/image
   */
  @Post('cloudinary/image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Returns Cloudinary image URL' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadImageCloudinary(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded.');
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      originalName: file.originalname,
      size: file.size,
    };
  }

  /**
   * POST /upload/cloudinary/video
   */
  @Post('cloudinary/video')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Returns Cloudinary video URL' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: videoFileFilter,
      limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max for video
    }),
  )
  async uploadVideoCloudinary(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded.');
    const result = await this.cloudinaryService.uploadVideo(file);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      originalName: file.originalname,
      size: file.size,
    };
  }

  @Public()
  @Get()
  @ApiResponse({ status: 200, description: 'Returns all uploaded files' })
  async listFiles() {
    return await this.uploadService.listFiles();
  }
}
