import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const assistantTaskApi = {
  getAll: (params) => axiosClient.get(API_ENDPOINTS.ASSISTANT_TASKS.LIST, { params }),
  getById: (id) => axiosClient.get(API_ENDPOINTS.ASSISTANT_TASKS.DETAIL(id)),
  create: (data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_TASKS.LIST, data),
};
