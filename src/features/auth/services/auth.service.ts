import axios from '@/core/api/axios';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';
import { API_ENDPOINTS } from '@/core/constants';
import { storage } from '@/core/utils';
import { STORAGE_KEYS } from '@/core/constants';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Save tokens to localStorage
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    storage.set(STORAGE_KEYS.USER, response.data.user);
    
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    // Save tokens to localStorage
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    storage.set(STORAGE_KEYS.USER, response.data.user);
    
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await axios.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Clear localStorage
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await axios.get<User>(API_ENDPOINTS.AUTH.ME);
    storage.set(STORAGE_KEYS.USER, response.data);
    return response.data;
  },

  async refreshToken(): Promise<string> {
    const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
    const response = await axios.post<{ accessToken: string }>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
    return response.data.accessToken;
  },
};
