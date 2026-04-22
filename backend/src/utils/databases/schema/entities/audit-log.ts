import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs', { schema: 'index_pos_admin' })
export class AuditLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('varchar', { name: 'user_name', length: 255, nullable: true })
  userName: string | null;

  @Column('varchar', { name: 'action', length: 100 })
  action: string;

  @Column('varchar', { name: 'module', length: 100 })
  module: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('json', { name: 'metadata', nullable: true })
  metadata: any | null;

  @Column('varchar', { name: 'ip_address', length: 45, nullable: true })
  ipAddress: string | null;

  @Column('varchar', { name: 'user_agent', length: 255, nullable: true })
  userAgent: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;
}
