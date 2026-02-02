import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const tempStatementApi = {
  /**
   * Create temp statement for temp question
   * @param {string} tempQuestionId - Temp question ID
   * @param {Object} data - Temp statement data
   * @returns {Promise}
   */
  create(tempQuestionId, data) {
    return axiosClient.post(API_ENDPOINTS.TEMP_STATEMENT.CREATE(tempQuestionId), data);
  },

  /**
   * Update temp statement
   * @param {string} tempStatementId - Temp statement ID
   * @param {Object} data - Update data
   * @returns {Promise}
   */
  update(tempStatementId, data) {
    return axiosClient.put(API_ENDPOINTS.TEMP_STATEMENT.UPDATE(tempStatementId), data);
  },

  /**
   * Delete temp statement
   * @param {string} tempStatementId - Temp statement ID
   * @returns {Promise}
   */
  delete(tempStatementId) {
    return axiosClient.delete(API_ENDPOINTS.TEMP_STATEMENT.DELETE(tempStatementId));
  },

  /**
   * Reorder temp statements
   * @param {Array} items - Array of {id, order} objects
   * @returns {Promise}
   */
  reorder(items) {
    return axiosClient.put(API_ENDPOINTS.TEMP_STATEMENT.REORDER, { items });
  },
};
