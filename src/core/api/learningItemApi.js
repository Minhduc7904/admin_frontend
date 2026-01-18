import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const learningItemApi = {
    /**
     * Get all learning items with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.lessonId - Filter by lesson ID
     * @param {number} params.createdBy - Filter by creator ID
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Learning items list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.LEARNING_ITEMS.LIST, { params });
    },

    /**
     * Get my learning items (created by current admin)
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} My learning items list with pagination
     */
    getMyLearningItems: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.LEARNING_ITEMS.MY_ITEMS, { params });
    },

    /**
     * Get learning item by ID
     * @param {number} id - Learning item ID
     * @returns {Promise<Object>} Learning item data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.LEARNING_ITEMS.DETAIL(id));
    },

    /**
     * Create a new learning item
     * @param {Object} data - Learning item data
     * @param {string} data.type - Learning item type (HOMEWORK, DOCUMENT, YOUTUBE, VIDEO) - required
     * @param {string} data.title - Learning item title (3-200 chars) - required
     * @param {string} data.description - Learning item description (max 1000 chars) - optional
     * @param {number} data.competitionId - Competition ID if homework is a competition - optional
     * @param {number} data.lessonId - Lesson ID to attach this learning item to - optional
     * @param {number} data.order - Order in lesson (auto-calculated if not provided) - optional
     * @param {number} data.createdBy - Creator admin ID - required
     * @returns {Promise<Object>} Created learning item
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.LEARNING_ITEMS.CREATE, data);
    },

    /**
     * Update learning item
     * @param {number} id - Learning item ID
     * @param {Object} data - Learning item data to update
     * @returns {Promise<Object>} Updated learning item
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.LEARNING_ITEMS.UPDATE(id), data);
    },

    /**
     * Delete learning item
     * @param {number} id - Learning item ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.LEARNING_ITEMS.DELETE(id));
    },
};
