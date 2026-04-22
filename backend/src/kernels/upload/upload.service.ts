import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

@Injectable()
export class UploadService {
  /**
   * Returns the public URL for an uploaded file.
   * In production swap this to return an S3/CDN URL instead.
   */
  getFileUrl(filename: string): string {
    // Local: served from /uploads/<filename>
    return `/uploads/${filename}`;
  }

  /** Absolute path to the uploads folder (used by multer). */
  static get uploadDir(): string {
    return join(process.cwd(), 'uploads');
  }

  async listFiles() {
    const dir = UploadService.uploadDir;
    if (!fs.existsSync(dir)) return [];
    
    const files = await readdir(dir);
    const list = await Promise.all(
      files.map(async (file) => {
        try {
          const s = await stat(join(dir, file));
          return {
            filename: file,
            url: this.getFileUrl(file),
            size: s.size,
            mtime: s.mtime,
            isDirectory: s.isDirectory(),
          };
        } catch (e) {
          return null;
        }
      }),
    );
    
    return list.filter((f) => f && !f.isDirectory);
  }
}
