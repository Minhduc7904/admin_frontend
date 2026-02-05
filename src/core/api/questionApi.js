import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const questionApi = {
    /**
     * Get all questions with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.subjectId - Subject ID filter
     * @param {string} params.type - Question type filter
     * @param {string} params.difficulty - Difficulty filter
     * @param {number} params.grade - Grade filter
     * @param {string} params.visibility - Visibility filter
     * @param {number} params.createdBy - Created by admin ID filter
     * @param {number} params.chapterId - Chapter ID filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Questions list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.QUESTIONS.LIST, { params });
    },

    /**
     * Get question by ID
     * @param {number} id - Question ID
     * @returns {Promise<Object>} Question data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.QUESTIONS.DETAIL(id));
    },

    /**
     * Create a new question
     * @param {Object} data - Question data
     * @param {string} data.content - Question content
     * @param {string} data.type - Question type
     * @param {string} data.correctAnswer - Correct answer
     * @param {string} data.solution - Solution explanation
     * @param {string} data.difficulty - Difficulty level
     * @param {number} data.grade - Grade level
     * @param {number} data.subjectId - Subject ID
     * @param {number} data.pointsOrigin - Points
     * @param {string} data.visibility - Visibility status
     * @param {number[]} data.chapterIds - Chapter IDs
     * @returns {Promise<Object>} Created question
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.QUESTIONS.CREATE, data);
    },

    /**
     * Update an existing question
     * @param {number} id - Question ID
     * @param {Object} data - Updated question data
     * @returns {Promise<Object>} Updated question
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.QUESTIONS.UPDATE(id), data);
    },

    /**
     * Delete a question
     * @param {number} id - Question ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.QUESTIONS.DELETE(id));
    },

    /**
     * Get questions by exam ID
     * @param {number} examId - Exam ID
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.type - Question type filter
     * @param {string} params.difficulty - Difficulty filter
     * @returns {Promise<Object>} Questions list with pagination
     */
    getByExam: (examId, params = {}) => {
        return axiosClient.get(API_ENDPOINTS.QUESTIONS.BY_EXAM(examId), { params });
    },
};
