import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const statementApi = {
    /**
     * Create a new statement for a question
     * @param {number} questionId - Question ID to attach statement to
     * @param {Object} data - Statement data
     * @param {string} data.content - Statement content
     * @param {boolean} data.isCorrect - Whether this is the correct answer
     * @param {number} data.order - Order of the statement
     * @param {string} data.difficulty - Difficulty level
     * @returns {Promise<Object>} Created statement
     */
    create: (questionId, data) => {
        return axiosClient.post(API_ENDPOINTS.STATEMENTS.CREATE(questionId), data);
    },

    /**
     * Update a statement
     * @param {number} id - Statement ID
     * @param {Object} data - Updated statement data
     * @param {string} data.content - Statement content
     * @param {boolean} data.isCorrect - Whether this is the correct answer
     * @param {number} data.order - Order of the statement
     * @param {string} data.difficulty - Difficulty level
     * @returns {Promise<Object>} Updated statement
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.STATEMENTS.UPDATE(id), data);
    },

    /**
     * Delete a statement
     * @param {number} id - Statement ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.STATEMENTS.DELETE(id));
    },
};
