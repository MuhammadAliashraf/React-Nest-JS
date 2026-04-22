import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { useAuthStore } from '../store/authStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const authStoreLogin = useAuthStore((s) => s.login);
  const authStoreLogout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Migration: Backend uses 'token', but shop frontend expects 'access'
      if (parsedUser.token && !parsedUser.access) {
        parsedUser.access = parsedUser.token;
        localStorage.setItem('user', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
      setIsAuthenticated(true);
      // Ensure store is also synced
      authStoreLogin({
        user: parsedUser,
        token: parsedUser.access,
        roles: parsedUser.roles,
        permissions: parsedUser.permissions,
      });
    }
    setLoading(false);
  }, []);

  const { fetchSettings } = useSettings();

  const login = (payload) => {
    // payload = { token, user, roles, permissions }
    const userData = {
      ...(payload.user || {}),
      access: payload.token || payload.access,
      refresh: payload.refresh,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));

    // Sync with Zustand store
    authStoreLogin({
      user: payload.user,
      token: payload.token || payload.access,
      roles: payload.roles,
      permissions: payload.permissions,
    });

    // Refresh global settings immediately after login
    fetchSettings();
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    authStoreLogout();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, updateUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
