import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI Store - manages sidebar collapse state and theme preference.
 */
export const useUIStore = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'dark',        // 'dark' | 'light'

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (val) => set({ sidebarOpen: val }),

      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'dark' ? 'light' : 'dark';
          // sync with document class
          document.documentElement.classList.toggle('dark', next === 'dark');
          return { theme: next };
        }),
    }),
    {
      name: 'admin-ui',
      partialize: (s) => ({ sidebarOpen: s.sidebarOpen, theme: s.theme }),
    }
  )
);
