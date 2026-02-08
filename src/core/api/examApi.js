import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const examApi = {
    /**
     * Get all exams with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.subjectId - Subject ID filter
     * @param {number} params.grade - Grade filter
     * @param {string} params.visibility - Visibility filter
     * @param {number} params.createdBy - Created by admin ID filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Exams list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.EXAMS.LIST, { params });
    },

    /**
     * Get my exams (created by current user) with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.subjectId - Subject ID filter
     * @param {number} params.grade - Grade filter
     * @param {string} params.visibility - Visibility filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Exams list with pagination
     */
    getMyExams: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.EXAMS.MY_EXAMS, { params });
    },

    /**
     * Get exam by ID
     * @param {number} id - Exam ID
     * @returns {Promise<Object>} Exam data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.EXAMS.DETAIL(id));
    },

    /**
     * Create a new exam
     * @param {Object} data - Exam data
     * @param {string} data.title - Exam title
     * @param {number} data.grade - Grade level
     * @param {string} data.visibility - Visibility status
     * @param {string} data.description - Exam description
     * @param {number} data.subjectId - Subject ID
     * @param {string} data.solutionYoutubeUrl - Solution video URL
     * @param {number[]} data.questionIds - Question IDs
     * @returns {Promise<Object>} Created exam
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.EXAMS.CREATE, data);
    },

    /**
     * Update an existing exam
     * @param {number} id - Exam ID
     * @param {Object} data - Updated exam data
     * @returns {Promise<Object>} Updated exam
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.EXAMS.UPDATE(id), data);
    },

    /**
     * Delete an exam
     * @param {number} id - Exam ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.EXAMS.DELETE(id));
    },
};
