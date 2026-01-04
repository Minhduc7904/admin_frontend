import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const adminApi = {
    /**
     * Get all admins with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Admins list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.ADMINS.LIST, { params });
    },

    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.ADMINS.DETAIL(id));
    },

    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.ADMINS.CREATE, data);
    }
};