import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const documentApi = {
    getAll: (params = {}) => axiosClient.get(API_ENDPOINTS.DOCUMENTS.LIST, { params }),
    getById: (id) => axiosClient.get(API_ENDPOINTS.DOCUMENTS.DETAIL(id)),
    getBySlug: (slug) => axiosClient.get(API_ENDPOINTS.DOCUMENTS.BY_SLUG(slug)),
    create: (data) => axiosClient.post(API_ENDPOINTS.DOCUMENTS.CREATE, data),
    update: (id, data) => axiosClient.put(API_ENDPOINTS.DOCUMENTS.UPDATE(id), data),
    delete: (id) => axiosClient.delete(API_ENDPOINTS.DOCUMENTS.DELETE(id)),
};
