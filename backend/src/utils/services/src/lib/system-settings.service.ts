import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettings, INDEX_POS_ADMIN_CONN } from '@databases';
import {
  CreateSystemSettingsDto,
  UpdateSystemSettingsDto,
} from '@utils/data-transfer-objects';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSettings, INDEX_POS_ADMIN_CONN)
    private readonly settingsRepository: Repository<SystemSettings>,
  ) {}

  async create(createDto: CreateSystemSettingsDto): Promise<SystemSettings> {
    const setting = this.settingsRepository.create(createDto);
    return await this.settingsRepository.save(setting);
  }

  async findAll(): Promise<SystemSettings[]> {
    return await this.settingsRepository.find();
  }

  async findByKey(key: string): Promise<SystemSettings> {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return setting;
  }

  async update(
    key: string,
    updateDto: UpdateSystemSettingsDto,
  ): Promise<SystemSettings> {
    const setting = await this.findByKey(key);
    Object.assign(setting, updateDto);
    return await this.settingsRepository.save(setting);
  }

  async getValue(
    key: string,
    defaultValue?: string,
  ): Promise<string | undefined> {
    try {
      const setting = await this.findByKey(key);
      return setting.value;
    } catch {
      return defaultValue;
    }
  }

  /** Accepts a flat { key: value } map and upserts every key in one go */
  async upsertBulk(
    data: Record<string, string>,
  ): Promise<Record<string, string>> {
    for (const [key, value] of Object.entries(data)) {
      const existing = await this.settingsRepository.findOne({
        where: { key },
      });
      if (existing) {
        existing.value = String(value);
        await this.settingsRepository.save(existing);
      } else {
        await this.settingsRepository.save(
          this.settingsRepository.create({ key, value: String(value) }),
        );
      }
    }
    return this.toMap(await this.settingsRepository.find());
  }

  /** Returns all settings as a flat { key: value } map */
  toMap(settings: SystemSettings[]): Record<string, string> {
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  }
}
