import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const homeworkContentApi = {
    /**
     * Get all homework contents with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.learningItemId - Filter by learning item ID
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Homework contents list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_CONTENTS.LIST, { params });
    },

    /**
     * Get homework content by ID
     * @param {number} id - Homework content ID
     * @returns {Promise<Object>} Homework content data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_CONTENTS.DETAIL(id));
    },

    /**
     * Create a new homework content
     * @param {Object} data - Homework content data
     * @param {number} data.learningItemId - Learning item ID
     * @param {string} data.content - Homework instructions/content
     * @returns {Promise<Object>} Created homework content
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.HOMEWORK_CONTENTS.CREATE, data);
    },

    /**
     * Update homework content
     * @param {number} id - Homework content ID
     * @param {Object} data - Homework content data to update
     * @returns {Promise<Object>} Updated homework content
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.HOMEWORK_CONTENTS.UPDATE(id), data);
    },

    /**
     * Delete homework content
     * @param {number} id - Homework content ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.HOMEWORK_CONTENTS.DELETE(id));
    },
};
