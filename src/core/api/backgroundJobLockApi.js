import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const backgroundJobLockApi = {
  getAll: (params = {}) => axiosClient.get(API_ENDPOINTS.BACKGROUND_JOBS.LOCKS, { params }),
};
