import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const tagApi = {
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.TAGS.LIST, { params });
    },

    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.TAGS.DETAIL(id));
    },

    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.TAGS.CREATE, data);
    },

    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.TAGS.UPDATE(id), data);
    },

    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.TAGS.DELETE(id));
    },
};
