import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const chapterApi = {
    /**
     * Get all chapters with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.subjectId - Subject ID filter
     * @param {number} params.parentChapterId - Parent chapter ID filter
     * @param {number} params.level - Chapter level filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Chapters list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.CHAPTERS.LIST, { params });
    },

    /**
     * Search chapters - lightweight search for autocomplete/dropdown
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search keyword
     * @param {number} params.subjectId - Subject ID filter (optional)
     * @returns {Promise<Object>} First 10 chapters sorted by orderInParent
     */
    search: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.CHAPTERS.SEARCH, { params });
    },

    /**
     * Get chapter by ID
     * @param {number} id - Chapter ID
     * @returns {Promise<Object>} Chapter data with children
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.CHAPTERS.DETAIL(id));
    },

    /**
     * Get chapters by subject ID
     * @param {number} subjectId - Subject ID
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Object>} Chapters list for subject
     */
    getBySubjectId: (subjectId, params = {}) => {
        return axiosClient.get(API_ENDPOINTS.CHAPTERS.LIST, {
            params: { ...params, subjectId }
        });
    },

    /**
     * Get children of a parent chapter - For lazy loading tree
     * @param {number} parentChapterId - Parent chapter ID
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Object>} Children chapters list
     */
    getByParentId: (parentChapterId, params = {}) => {
        return axiosClient.get(`/chapters/${parentChapterId}/children`, { params });
    },

    /**
     * Get root chapters (chapters without parent) - For lazy loading tree
     * @param {Object} params - Query parameters
     * @param {number} params.subjectId - Subject ID filter (optional)
     * @returns {Promise<Object>} Root chapters list
     */
    getRootChapters: (params = {}) => {
        return axiosClient.get('/chapters/root', { params });
    },

    /**
     * Create a new chapter
     * @param {Object} data - Chapter data
     * @param {number} data.subjectId - Subject ID
     * @param {string} data.name - Chapter name
     * @param {string} data.code - Chapter code
     * @param {string} data.slug - Chapter slug
     * @param {number} data.parentChapterId - Parent chapter ID (optional)
     * @param {number} data.orderInParent - Order in parent
     * @param {number} data.level - Chapter level
     * @returns {Promise<Object>} Created chapter
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.CHAPTERS.CREATE, data);
    },

    /**
     * Update chapter
     * @param {number} id - Chapter ID
     * @param {Object} data - Chapter data to update
     * @returns {Promise<Object>} Updated chapter
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.CHAPTERS.UPDATE(id), data);
    },

    /**
     * Delete chapter
     * @param {number} id - Chapter ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.CHAPTERS.DELETE(id));
    },
};
