import { CreateUserDto, UpdateUserDto } from '@utils/data-transfer-objects';
import { INDEX_POS_ADMIN_CONN, Users } from '@databases/databases.module';
import { hashPassword } from '@utils/helpers';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users, INDEX_POS_ADMIN_CONN)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ jwtToken: string; user: Users }> {
    // Check if email already exists
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = hashPassword(createUserDto.password);

    // Generate user code (simple implementation)
    const count = await this.usersRepository.count();
    const userCode = `USR-${(count + 1).toString().padStart(3, '0')}`;

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      userCode,
      isActive: true,
    });

    const result = await this.usersRepository.save(user);

    const payload = {
      username: result.email,
      sub: result.id,
    };

    const jwtToken = this.jwtService.sign(payload, {
      secret: String(process.env['JWT_SECRET']),
    });

    result.password = '';

    return { jwtToken, user: result };
  }

  async findAll(
    limit = 10,
    offset = 0,
    search?: string,
  ): Promise<[Users[], number]> {
    return await this.usersRepository.findAndCount({
      where: search
        ? [
            { name: Like(`%${search}%`), isDeleted: false },
            { email: Like(`%${search}%`), isDeleted: false },
            { userCode: Like(`%${search}%`), isDeleted: false },
          ]
        : { isDeleted: false },
      order: { id: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<Users> {
    const user = await this.findOne(id);

    if (updateDto.password) {
      updateDto.password = hashPassword(updateDto.password);
    }

    Object.assign(user, updateDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.isDeleted = true;
    user.deletedAt = new Date();
    await this.usersRepository.save(user);
  }

  async checkAvailability(email: string, excludeId?: number): Promise<boolean> {
    const existing = await this.usersRepository.findOne({
      where: {
        email,
        id: excludeId ? Not(excludeId) : undefined,
      },
    });
    return !existing;
  }
}
