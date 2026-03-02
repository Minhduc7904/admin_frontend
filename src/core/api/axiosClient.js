import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS, ROUTES } from "../constants";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000, // 600 giây
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.group(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log("Base URL:", config.baseURL);
      console.log("Full URL:", `${config.baseURL}${config.url}`);
      console.log("Headers:", config.headers);
      if (config.data) {
        console.log("Body:", config.data);
      }
      if (config.params) {
        console.log("Params:", config.params);
      }
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("❌ Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.group(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url
        }`
      );
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.groupEnd();
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (import.meta.env.DEV) {
      console.group(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url
        }`
      );
      console.error("Status:", error.response?.status);
      console.error("Message:", error.response?.data?.message || error.message);
      console.error("Full Error:", error.response?.data);
      console.groupEnd();
    }

    console.log('Original Request:', originalRequest._retry);

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        console.log('Refresh response:', response);

        const { accessToken } = response.data;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);

        if (typeof window !== "undefined") {
          // Use import.meta.env.BASE_URL to respect Vite base path (e.g. /admin/)
          // so we navigate to /admin/login instead of /login
          const base = import.meta.env.BASE_URL || '/';
          window.location.href = base.replace(/\/$/, '') + ROUTES.LOGIN;
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

export default axiosClient;
