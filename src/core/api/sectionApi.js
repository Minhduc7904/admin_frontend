import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const sectionApi = {
    /**
     * Get all sections by exam ID
     * @param {number} examId - Exam ID
     * @returns {Promise<Object>} Sections list
     */
    getByExam: (examId) => {
        return axiosClient.get(API_ENDPOINTS.SECTIONS.BY_EXAM(examId));
    },

    /**
     * Get section by ID
     * @param {number} id - Section ID
     * @returns {Promise<Object>} Section data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.SECTIONS.DETAIL(id));
    },

    /**
     * Create a new section
     * @param {Object} data - Section data
     * @param {number} data.examId - Exam ID
     * @param {string} data.title - Section title
     * @param {string} data.description - Section description
     * @param {number} data.order - Section order
     * @returns {Promise<Object>} Created section
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.SECTIONS.CREATE, data);
    },

    /**
     * Update an existing section
     * @param {number} id - Section ID
     * @param {Object} data - Updated section data
     * @returns {Promise<Object>} Updated section
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.SECTIONS.UPDATE(id), data);
    },

    /**
     * Delete a section
     * @param {number} id - Section ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.SECTIONS.DELETE(id));
    },
};
