import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store - manages user session, roles, and permissions.
 * Persisted to localStorage so sessions survive page refresh.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      /* ── state ── */
      user: null,        // { id, name, email, avatar }
      token: null,       // JWT access token
      roles: [],         // e.g. ['admin', 'editor']
      permissions: [],   // e.g. ['product.create', 'order.view']
      isAuthenticated: false,

      /* ── actions ── */
      login: (payload) => {
        // payload = { user, token, roles, permissions }
        set({
          user: payload.user,
          token: payload.token,
          roles: payload.roles ?? [],
          permissions: payload.permissions ?? [],
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          roles: [],
          permissions: [],
          isAuthenticated: false,
        });
      },

      /** Update permissions after role change on the server */
      setPermissions: (permissions) => set({ permissions }),

      /** Quick helper to check one permission */
      hasPermission: (perm) => get().permissions.includes(perm),

      /** Check if user has at least one of the given roles */
      hasRole: (role) => get().roles.includes(role),
    }),
    {
      name: 'auth-storage',         // localStorage key
      partialize: (state) => ({   // only persist these fields
        user: state.user,
        token: state.token,
        roles: state.roles,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
