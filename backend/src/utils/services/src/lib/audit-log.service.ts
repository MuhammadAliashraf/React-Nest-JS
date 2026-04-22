import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, INDEX_POS_ADMIN_CONN } from '@databases';
import { CreateAuditLogDto } from '@utils/data-transfer-objects';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog, INDEX_POS_ADMIN_CONN)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createDto: CreateAuditLogDto): Promise<AuditLog> {
    const log = this.auditLogRepository.create(createDto);
    return await this.auditLogRepository.save(log);
  }

  async findAll(limit = 100, offset = 0): Promise<[AuditLog[], number]> {
    return await this.auditLogRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findByUserId(userId: number): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
