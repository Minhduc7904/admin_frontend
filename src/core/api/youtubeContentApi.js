import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const youtubeContentApi = {
    /**
     * Get all youtube contents with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.learningItemId - Filter by learning item ID
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Youtube contents list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.YOUTUBE_CONTENTS.LIST, { params });
    },

    /**
     * Get youtube content by ID
     * @param {number} id - Youtube content ID
     * @returns {Promise<Object>} Youtube content data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.YOUTUBE_CONTENTS.DETAIL(id));
    },

    /**
     * Create a new youtube content
     * @param {Object} data - Youtube content data
     * @param {number} data.learningItemId - Learning item ID
     * @param {string} data.content - Content/description
     * @param {string} data.youtubeUrl - Youtube video URL
     * @returns {Promise<Object>} Created youtube content
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.YOUTUBE_CONTENTS.CREATE, data);
    },

    /**
     * Update youtube content
     * @param {number} id - Youtube content ID
     * @param {Object} data - Youtube content data to update
     * @returns {Promise<Object>} Updated youtube content
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.YOUTUBE_CONTENTS.UPDATE(id), data);
    },

    /**
     * Delete youtube content
     * @param {number} id - Youtube content ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.YOUTUBE_CONTENTS.DELETE(id));
    },
};
