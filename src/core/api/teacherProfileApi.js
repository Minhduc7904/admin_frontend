import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const teacherProfileApi = {
    getAll: (params = {}) => axiosClient.get(API_ENDPOINTS.TEACHER_PROFILES.LIST, { params }),
    getById: (id) => axiosClient.get(API_ENDPOINTS.TEACHER_PROFILES.DETAIL(id)),
    create: (data) => axiosClient.post(API_ENDPOINTS.TEACHER_PROFILES.CREATE, data),
    update: (id, data) => axiosClient.put(API_ENDPOINTS.TEACHER_PROFILES.UPDATE(id), data),
    delete: (id) => axiosClient.delete(API_ENDPOINTS.TEACHER_PROFILES.DELETE(id)),
};
