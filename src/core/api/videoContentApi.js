import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const videoContentApi = {
    /**
     * Get all video contents with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.learningItemId - Filter by learning item ID
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Video contents list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.VIDEO_CONTENTS.LIST, { params });
    },

    /**
     * Get video content by ID
     * @param {number} id - Video content ID
     * @returns {Promise<Object>} Video content data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.VIDEO_CONTENTS.DETAIL(id));
    },

    /**
     * Create a new video content
     * @param {Object} data - Video content data
     * @param {number} data.learningItemId - Learning item ID
     * @param {string} data.content - Video content/description
     * @returns {Promise<Object>} Created video content
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.VIDEO_CONTENTS.CREATE, data);
    },

    /**
     * Update video content
     * @param {number} id - Video content ID
     * @param {Object} data - Video content data to update
     * @returns {Promise<Object>} Updated video content
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.VIDEO_CONTENTS.UPDATE(id), data);
    },

    /**
     * Delete video content
     * @param {number} id - Video content ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.VIDEO_CONTENTS.DELETE(id));
    },
};
