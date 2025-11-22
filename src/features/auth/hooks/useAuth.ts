import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { login, logout, clearError } from '../store/authSlice';
import type { LoginCredentials } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, status, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials: LoginCredentials) => {
    const result = await dispatch(login(credentials));
    return result;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading: status === 'pending',
    error,
    login: handleLogin,
    logout: handleLogout,
    clearError: clearAuthError,
  };
};
