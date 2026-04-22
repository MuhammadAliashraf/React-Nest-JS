import { ApiProperty } from '@nestjs/swagger';

export class PayloadDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'User ID',
    example: 1,
  })
  userId!: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User Code',
    example: 'USR-001',
  })
  userCode!: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Email',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Name',
    example: 'John Doe',
  })
  name!: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Role',
    example: 'admin',
  })
  role!: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    description: 'Is Active',
    example: true,
  })
  isActive!: boolean | null;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Roles',
    example: ['admin'],
  })
  roles?: string[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Permissions',
    example: ['user.view'],
  })
  permissions?: string[];
}

export class SessionDto extends PayloadDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Access Token',
    example: '1234567890',
  })
  accessToken!: string;
}
