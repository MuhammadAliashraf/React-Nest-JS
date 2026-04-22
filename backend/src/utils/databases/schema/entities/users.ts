import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users', { schema: 'index_pos_admin' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'user_code', length: 10, nullable: true })
  userCode: string;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'email', length: 255 })
  email: string;

  @Column('varchar', {
    name: 'role',
    length: 50,
    nullable: true,
    default: 'SUBSCRIBER',
  })
  role: string;

  @Exclude()
  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('varchar', {
    name: 'reset_password_token',
    nullable: true,
  })
  resetPasswordToken: string | null;

  @Column('timestamp', {
    name: 'reset_password_expires',
    nullable: true,
  })
  resetPasswordExpires: Date | null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column('varchar', { name: 'avatar', length: 500, nullable: true })
  avatar: string;

  @Column('varchar', { name: 'address', length: 255, nullable: true })
  address: string;

  @Column('varchar', { name: 'city', length: 100, nullable: true })
  city: string;

  @Column('varchar', { name: 'zip_code', length: 20, nullable: true })
  zipCode: string;

  @Column('varchar', { name: 'country', length: 100, nullable: true })
  country: string;

  @Column('boolean', {
    name: 'is_active',
    default: () => 'true',
  })
  isActive: boolean;

  @Column('boolean', {
    name: 'is_deleted',
    default: () => 'false',
  })
  isDeleted: boolean;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date | null;
}
