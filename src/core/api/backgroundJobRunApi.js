import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const backgroundJobRunApi = {
  getAll: (params = {}) => axiosClient.get(API_ENDPOINTS.BACKGROUND_JOBS.RUNS, { params }),
  getById: (id) => axiosClient.get(API_ENDPOINTS.BACKGROUND_JOBS.RUN_DETAIL(id)),
};
