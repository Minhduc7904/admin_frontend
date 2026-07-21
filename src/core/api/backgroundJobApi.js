import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const backgroundJobApi = {
  getAll: (params = {}) => axiosClient.get(API_ENDPOINTS.BACKGROUND_JOBS.LIST, { params }),
  getById: (id) => axiosClient.get(API_ENDPOINTS.BACKGROUND_JOBS.DETAIL(id)),
  update: (id, data) => axiosClient.put(API_ENDPOINTS.BACKGROUND_JOBS.DETAIL(id), data),
};
