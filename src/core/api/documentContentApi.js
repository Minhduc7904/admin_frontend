import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const documentContentApi = {
    /**
     * Get all document contents with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.learningItemId - Filter by learning item ID
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Document contents list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.DOCUMENT_CONTENTS.LIST, { params });
    },

    /**
     * Get document content by ID
     * @param {number} id - Document content ID
     * @returns {Promise<Object>} Document content data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.DOCUMENT_CONTENTS.DETAIL(id));
    },

    /**
     * Create a new document content
     * @param {Object} data - Document content data
     * @param {number} data.learningItemId - Learning item ID
     * @param {string} data.content - Document content/text
     * @param {number} data.orderInDocument - Order in document
     * @returns {Promise<Object>} Created document content
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.DOCUMENT_CONTENTS.CREATE, data);
    },

    /**
     * Update document content
     * @param {number} id - Document content ID
     * @param {Object} data - Document content data to update
     * @returns {Promise<Object>} Updated document content
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.DOCUMENT_CONTENTS.UPDATE(id), data);
    },

    /**
     * Delete document content
     * @param {number} id - Document content ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.DOCUMENT_CONTENTS.DELETE(id));
    },
};
