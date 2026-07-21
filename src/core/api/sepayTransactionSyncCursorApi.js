import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const sepayTransactionSyncCursorApi = {
  getAll: (params = {}) => axiosClient.get(API_ENDPOINTS.BACKGROUND_JOBS.SEPAY_SYNC_CURSORS, { params }),
  update: (scope, data) => axiosClient.put(API_ENDPOINTS.BACKGROUND_JOBS.SEPAY_SYNC_CURSOR(scope), data),
};
