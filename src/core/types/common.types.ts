// Common types used across the application

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';

export interface BaseEntity {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}
