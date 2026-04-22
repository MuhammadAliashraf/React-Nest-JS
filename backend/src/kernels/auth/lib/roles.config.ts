export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  SUPPORT = 'SUPPORT',
  SUBSCRIBER = 'SUBSCRIBER',
}

export const RolePermissions: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: [
    'user.view',
    'user.create',
    'user.edit',
    'user.delete',
    'role.view',
    'role.create',
    'role.edit',
    'role.delete',
    'settings.view',
    'settings.edit',
  ],
  [UserRole.ADMIN]: [
    'user.view',
    'user.create',
    'user.edit',
    'settings.view',
  ],
  [UserRole.EDITOR]: [
    'user.view',
  ],
  [UserRole.SUPPORT]: [
    'user.view',
  ],
  [UserRole.SUBSCRIBER]: [
    'user.view',
  ],
};
