import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_URL = import.meta.env.VITE_API_URL + "/";

// Central Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/* ── Request interceptor: attach JWT token ── */
api.interceptors.request.use((config) => {
  // Check if the request explicitly asks for auth (default to true)
  const requiresAuth = config.requiresAuth !== false;

  if (requiresAuth) {
    // Try to get token from Zustand store first, fallback to localStorage
    const token = useAuthStore.getState().token || JSON.parse(localStorage.getItem("user"))?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/* ── Response interceptor: handle unwrapping and errors ── */
api.interceptors.response.use(
  (response) => {
    // Backend wraps everything in { success, data, message, statusCode }
    // We return the inner 'data' for easier consumption in components.
    return response.data?.data ?? response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle 401 Unauthorized — token missing/expired
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = JSON.parse(localStorage.getItem("user"));

      if (user && user.refresh) {
        try {
          // Attempt to refresh the token
          const res = await axios.post(`${API_URL}users/refresh/`, {
            refresh: user.refresh,
          });
          const newAccess = res.data.access;
          
          // Update both localStorage and Zustand store
          user.access = newAccess;
          localStorage.setItem("user", JSON.stringify(user));
          useAuthStore.getState().login({ user, token: newAccess });

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed — clear session and force login
          useAuthStore.getState().logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token — force logout
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      // For now, treat as unauthorized if they don't have permissions
      // Alternatively, redirect to a /forbidden page
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error.response?.data || error);
  },
);

export default api;

/**
 * Common API Request Wrapper (Backward Compatibility)
 * Returns { success: boolean, data: T, status: number }
 */
export const apiRequest = async ({
  method,
  endpoint,
  data,
  params,
  headers = {},
  endslash = false, // Set to false by default for NestJS compatibility
  requiresAuth = true,
}) => {
  try {
    const responseData = await api({
      method,
      url: endslash ? `${endpoint}/` : endpoint,
      data,
      params,
      headers,
      requiresAuth,
    });

    return {
      success: true,
      data: responseData,
      status: 200, // Normalized
    };
  } catch (error) {
    console.error("API Request Error:", {
      method,
      endpoint,
      error: error.message || error,
    });

    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      status: error.status || 500,
    };
  }
};

/* ── Exported Helpers for Functional Programming Style ── */

export const getApi = (endpoint, params, auth = true, headers = {}, slash = false) => 
  apiRequest({ method: "GET", endpoint, params, requiresAuth: auth, headers, endslash: slash });

export const postApi = (endpoint, data, params = null, auth = true, headers = {}, slash = false) => 
  apiRequest({ method: "POST", endpoint, data, params, requiresAuth: auth, headers, endslash: slash });

export const putApi = (endpoint, data, params = null, auth = true, headers = {}, slash = false) => 
  apiRequest({ method: "PUT", endpoint, data, params, requiresAuth: auth, headers, endslash: slash });

export const patchApi = (endpoint, data, params = null, auth = true, headers = {}, slash = false) => 
  apiRequest({ method: "PATCH", endpoint, data, params, requiresAuth: auth, headers, endslash: slash });

export const deleteApi = (endpoint, params, auth = true, headers = {}, slash = false) => 
  apiRequest({ method: "DELETE", endpoint, params, requiresAuth: auth, headers, endslash: slash });
