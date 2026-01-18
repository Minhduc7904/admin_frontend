import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const homeworkSubmitApi = {
    /**
     * Get all homework submits with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.homeworkContentId - Filter by homework content ID
     * @param {number} params.studentId - Filter by student ID
     * @param {number} params.graderId - Filter by grader ID
     * @param {boolean} params.isGraded - Filter by graded status
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Homework submits list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_SUBMITS.LIST, { params });
    },

    /**
     * Get homework submit by ID
     * @param {number} id - Homework submit ID
     * @returns {Promise<Object>} Homework submit data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_SUBMITS.DETAIL(id));
    },

    /**
     * Create a new homework submit
     * @param {Object} data - Homework submit data
     * @param {number} data.homeworkContentId - Homework content ID
     * @param {number} data.studentId - Student ID
     * @param {string} data.content - Submit content/answer
     * @returns {Promise<Object>} Created homework submit
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.HOMEWORK_SUBMITS.CREATE, data);
    },

    /**
     * Update homework submit
     * @param {number} id - Homework submit ID
     * @param {Object} data - Homework submit data to update
     * @returns {Promise<Object>} Updated homework submit
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.HOMEWORK_SUBMITS.UPDATE(id), data);
    },

    /**
     * Grade a homework submit
     * @param {number} id - Homework submit ID
     * @param {Object} data - Grading data
     * @param {number} data.points - Points awarded
     * @param {number} data.graderId - Grader admin ID
     * @param {string} data.feedback - Grading feedback (optional)
     * @returns {Promise<Object>} Graded homework submit
     */
    grade: (id, data) => {
        return axiosClient.patch(API_ENDPOINTS.HOMEWORK_SUBMITS.GRADE(id), data);
    },

    /**
     * Delete homework submit
     * @param {number} id - Homework submit ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.HOMEWORK_SUBMITS.DELETE(id));
    },
};
