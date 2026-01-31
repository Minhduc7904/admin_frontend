import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const tempExamApi = {
  /**
   * Get temp exam by session ID
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  getBySessionId(sessionId) {
    return axiosClient.get(API_ENDPOINTS.TEMP_EXAM.BY_SESSION(sessionId));
  },

  /**
   * Create temp exam for session
   * @param {string} sessionId - Session ID
   * @param {Object} data - Temp exam data
   * @returns {Promise}
   */
  create(sessionId, data) {
    return axiosClient.post(API_ENDPOINTS.TEMP_EXAM.CREATE(sessionId), data);
  },

  /**
   * Update temp exam
   * @param {string} tempExamId - Temp exam ID
   * @param {Object} data - Update data
   * @returns {Promise}
   */
  update(tempExamId, data) {
    return axiosClient.put(API_ENDPOINTS.TEMP_EXAM.UPDATE(tempExamId), data);
  },
};
