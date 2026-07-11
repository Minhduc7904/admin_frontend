import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const newsArticleApi = {
    getAll: (params = {}) => axiosClient.get(API_ENDPOINTS.NEWS_ARTICLES.LIST, { params }),
    getById: (id) => axiosClient.get(API_ENDPOINTS.NEWS_ARTICLES.DETAIL(id)),
    create: (data) => axiosClient.post(API_ENDPOINTS.NEWS_ARTICLES.CREATE, data),
    update: (id, data) => axiosClient.put(API_ENDPOINTS.NEWS_ARTICLES.UPDATE(id), data),
    delete: (id) => axiosClient.delete(API_ENDPOINTS.NEWS_ARTICLES.DELETE(id)),
};
