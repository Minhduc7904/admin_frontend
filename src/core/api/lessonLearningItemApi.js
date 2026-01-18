import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const lessonLearningItemApi = {
    /**
     * Get all lesson learning items with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {number} params.lessonId - Filter by lesson ID
     * @param {number} params.learningItemId - Filter by learning item ID
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Lesson learning items list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.LESSON_LEARNING_ITEMS.LIST, { params });
    },

    /**
     * Get lesson learning item by composite ID
     * @param {number} lessonId - Lesson ID
     * @param {number} learningItemId - Learning item ID
     * @returns {Promise<Object>} Lesson learning item data
     */
    getById: (lessonId, learningItemId) => {
        return axiosClient.get(API_ENDPOINTS.LESSON_LEARNING_ITEMS.DETAIL(lessonId, learningItemId));
    },

    /**
     * Create a new lesson learning item (attach learning item to lesson)
     * @param {Object} data - Lesson learning item data
     * @param {number} data.lessonId - Lesson ID
     * @param {number} data.learningItemId - Learning item ID
     * @param {number} data.orderNumber - Order number in the lesson
     * @returns {Promise<Object>} Created lesson learning item
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.LESSON_LEARNING_ITEMS.CREATE, data);
    },

    /**
     * Delete lesson learning item (detach learning item from lesson)
     * @param {number} lessonId - Lesson ID
     * @param {number} learningItemId - Learning item ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (lessonId, learningItemId) => {
        return axiosClient.delete(API_ENDPOINTS.LESSON_LEARNING_ITEMS.DELETE(lessonId, learningItemId));
    },
};
