import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const subjectApi = {
    /**
     * Get all subjects with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {string} params.code - Subject code filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Subjects list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.SUBJECTS.LIST, { params });
    },

    /**
     * Get subject by ID
     * @param {number} id - Subject ID
     * @returns {Promise<Object>} Subject data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.SUBJECTS.DETAIL(id));
    },

    /**
     * Create a new subject
     * @param {Object} data - Subject data
     * @param {string} data.name - Subject name
     * @param {string} data.code - Subject code
     * @returns {Promise<Object>} Created subject
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.SUBJECTS.CREATE, data);
    },

    /**
     * Update subject
     * @param {number} id - Subject ID
     * @param {Object} data - Subject data to update
     * @returns {Promise<Object>} Updated subject
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.SUBJECTS.UPDATE(id), data);
    },

    /**
     * Delete subject
     * @param {number} id - Subject ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.SUBJECTS.DELETE(id));
    },
};
