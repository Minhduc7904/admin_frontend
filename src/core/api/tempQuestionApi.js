import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const tempQuestionApi = {
  /**
   * Get temp questions by session ID
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  getBySessionId(sessionId) {
    return axiosClient.get(API_ENDPOINTS.TEMP_QUESTION.BY_SESSION(sessionId));
  },

  /**
   * Get temp question by ID
   * @param {string} tempQuestionId - Temp question ID
   * @returns {Promise}
   */
  getById(tempQuestionId) {
    return axiosClient.get(API_ENDPOINTS.TEMP_QUESTION.BY_ID(tempQuestionId));
  },

  /**
   * Create temp question for session
   * @param {string} sessionId - Session ID
   * @param {Object} data - Temp question data
   * @returns {Promise}
   */
  create(sessionId, data) {
    return axiosClient.post(API_ENDPOINTS.TEMP_QUESTION.CREATE(sessionId), data);
  },

  /**
   * Update temp question
   * @param {string} tempQuestionId - Temp question ID
   * @param {Object} data - Update data
   * @returns {Promise}
   */
  update(tempQuestionId, data) {
    return axiosClient.put(API_ENDPOINTS.TEMP_QUESTION.UPDATE(tempQuestionId), data);
  },

  /**
   * Delete temp question
   * @param {string} tempQuestionId - Temp question ID
   * @returns {Promise}
   */
  delete(tempQuestionId) {
    return axiosClient.delete(API_ENDPOINTS.TEMP_QUESTION.DELETE(tempQuestionId));
  },

  /**
   * Reorder temp questions
   * @param {Array} items - Array of {id, order} objects
   * @returns {Promise}
   */
  reorder(items) {
    return axiosClient.put(API_ENDPOINTS.TEMP_QUESTION.REORDER, { items });
  },

  /**
   * Link question to section or unlink (set to null)
   * @param {string} tempQuestionId - Temp question ID
   * @param {number|null} tempSectionId - Section ID to link to, or null to unlink
   * @returns {Promise}
   */
  linkToSection(tempQuestionId, tempSectionId) {
    return axiosClient.put(
      API_ENDPOINTS.TEMP_QUESTION.LINK_SECTION(tempQuestionId),
      { tempSectionId }
    );
  },
};
