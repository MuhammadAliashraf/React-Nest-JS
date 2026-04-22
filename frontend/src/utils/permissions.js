import { useAuthStore } from '@/store/authStore';

/**
 * canAccess(permission)
 * Returns true if the current user has the given permission string.
 *
 * Usage:
 *   canAccess('product.create')  → true | false
 *   canAccess(['product.edit', 'product.delete'])  → true if any match
 */
export function canAccess(permission) {
  const permissions = useAuthStore.getState().permissions || [];

  if (Array.isArray(permission)) {
    return permission.some((p) => permissions.includes(p));
  }
  return permissions.includes(permission);
}

/**
 * hasRole(role)
 * Returns true if the user has the given role.
 */
export function hasRole(role) {
  const roles = useAuthStore.getState().roles || [];
  if (Array.isArray(role)) {
    return role.some((r) => roles.includes(r));
  }
  return roles.includes(role);
}

/**
 * isAdmin()
 * Quick check if current user is an admin.
 */
export function isAdmin() {
  return hasRole('ADMIN') || hasRole('SUPER_ADMIN');
}
