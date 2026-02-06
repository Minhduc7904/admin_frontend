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

    /**
     * Reorder questions in an exam
     * @param {Object} data - Reorder data
     * @param {number} data.examId - Exam ID
     * @param {Array} data.items - Array of {questionId, order}
     * @returns {Promise<Object>} Reorder result
     */
    reorder: (data) => {
        return axiosClient.put(API_ENDPOINTS.QUESTIONS.REORDER, data);
    },

    /**
     * Remove a question from an exam
     * @param {Object} data - Remove data
     * @param {number} data.examId - Exam ID
     * @param {number} data.questionId - Question ID
     * @returns {Promise<Object>} Remove result
     */
    removeFromExam: (data) => {
        return axiosClient.delete(API_ENDPOINTS.QUESTIONS.REMOVE_FROM_EXAM, { data });
    },

    /**
     * Add a question to a section in an exam
     * @param {Object} data - Add to section data
     * @param {number} data.examId - Exam ID
     * @param {number} data.questionId - Question ID
     * @param {number} data.sectionId - Section ID
     * @param {number} [data.order] - Optional order position
     * @param {number} [data.points] - Optional points
     * @returns {Promise<Object>} Add result
     */
    addToSection: (data) => {
        return axiosClient.post(API_ENDPOINTS.QUESTIONS.ADD_TO_SECTION, data);
    },
};
