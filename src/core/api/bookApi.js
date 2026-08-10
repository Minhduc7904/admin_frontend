import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const bookApi = {
  // Serialize category arrays as repeated query keys, e.g.
  // categorySlugs=a&categorySlugs=b.
  getAll: (params = {}) => axiosClient.get(API_ENDPOINTS.BOOKS.LIST, {
    params,
    paramsSerializer: { indexes: null },
  }),
  getById: (id) => axiosClient.get(API_ENDPOINTS.BOOKS.DETAIL(id)),
  create: (data) => axiosClient.post(API_ENDPOINTS.BOOKS.CREATE, data),
  update: (id, data) => axiosClient.put(API_ENDPOINTS.BOOKS.UPDATE(id), data),
  updateMedia: (id, data) => axiosClient.put(API_ENDPOINTS.BOOKS.UPDATE_MEDIA(id), data),
  delete: (id) => axiosClient.delete(API_ENDPOINTS.BOOKS.DELETE(id)),
  getCategories: () => axiosClient.get(API_ENDPOINTS.BOOKS.CATEGORIES.LIST),
  createCategory: (data) => axiosClient.post(API_ENDPOINTS.BOOKS.CATEGORIES.CREATE, data),
  updateCategory: (id, data) => axiosClient.put(API_ENDPOINTS.BOOKS.CATEGORIES.UPDATE(id), data),
  deleteCategory: (id) => axiosClient.delete(API_ENDPOINTS.BOOKS.CATEGORIES.DELETE(id)),
  getSalesContactConfiguration: () => axiosClient.get(API_ENDPOINTS.BOOKS.SALES_CONTACT_CONFIGURATION.GET),
  updateSalesContactConfiguration: (data) => axiosClient.put(API_ENDPOINTS.BOOKS.SALES_CONTACT_CONFIGURATION.UPDATE, data),
};
