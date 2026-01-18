import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const lessonApi = {
    /**
     * Get all lessons with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.courseId - Filter by course ID
     * @param {string} params.teacherId - Filter by teacher ID
     * @param {string} params.search - Search keyword
     * @param {number} params.chapterId - Filter by chapter ID
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Lessons list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.LESSONS.LIST, { params });
    },

    /**
     * Get lesson by ID
     * @param {number} id - Lesson ID
     * @returns {Promise<Object>} Lesson data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.LESSONS.DETAIL(id));
    },

    /**
     * Create a new lesson
     * @param {Object} data - Lesson data
     * @param {number} data.courseId - Course ID
     * @param {string} data.title - Title
     * @param {number} data.teacherId - Teacher ID
     * @param {number[]} data.chapterIds - Chapter IDs
     * @param {string} data.lessonName - Lesson name
     * @param {string} data.visibility - Lesson visibility
     * @param {boolean} data.allowTrial - Allow trial flag
     * @param {string} data.description - Lesson description
     * @param {number} data.orderInCourse - Lesson order number
     * @returns {Promise<Object>} Created lesson
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.LESSONS.CREATE, data);
    },

    /**
     * Update lesson
     * @param {number} id - Lesson ID
     * @param {string} data.visibility - Lesson visibility
     * @param {number} data.orderInCourse - Lesson order number
     * @param {number} data.teacherId - Teacher ID
     * @param {boolean} data.allowTrial - Allow trial flag
     * @param {number[]} data.chapterIds - Chapter IDs
     * @param {string} data.title - Title
     * @param {string} data.description - Lesson description
     * @param {Object} data - Lesson data to update
     * @returns {Promise<Object>} Updated lesson
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.LESSONS.UPDATE(id), data);
    },

    /**
     * Delete lesson
     * @param {number} id - Lesson ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.LESSONS.DELETE(id));
    },
};
