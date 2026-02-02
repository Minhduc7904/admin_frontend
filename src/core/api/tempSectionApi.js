import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const tempSectionApi = {
  /**
   * Get temp sections by session ID
   * @param {number} sessionId - Session ID
   * @returns {Promise}
   */
  getBySessionId(sessionId) {
    return axiosClient.get(API_ENDPOINTS.TEMP_SECTION.BY_SESSION(sessionId));
  },

  /**
   * Get temp section by ID
   * @param {string} tempSectionId - Temp section ID
   * @returns {Promise}
   */
  getById(tempSectionId) {
    return axiosClient.get(API_ENDPOINTS.TEMP_SECTION.BY_ID(tempSectionId));
  },

  /**
   * Create temp section for session
   * @param {number} sessionId - Session ID
   * @param {Object} data - Temp section data
   * @returns {Promise}
   */
  create(sessionId, data) {
    return axiosClient.post(API_ENDPOINTS.TEMP_SECTION.CREATE(sessionId), data);
  },

  /**
   * Update temp section
   * @param {string} tempSectionId - Temp section ID
   * @param {Object} data - Update data
   * @returns {Promise}
   */
  update(tempSectionId, data) {
    return axiosClient.put(API_ENDPOINTS.TEMP_SECTION.UPDATE(tempSectionId), data);
  },

  /**
   * Delete temp section
   * @param {string} tempSectionId - Temp section ID
   * @returns {Promise}
   */
  delete(tempSectionId) {
    return axiosClient.delete(API_ENDPOINTS.TEMP_SECTION.DELETE(tempSectionId));
  },

  /**
   * Reorder temp sections
   * @param {Array} items - Array of {id, order} objects
   * @returns {Promise}
   */
  reorder(items) {
    return axiosClient.put(API_ENDPOINTS.TEMP_SECTION.REORDER, { items });
  },
};
