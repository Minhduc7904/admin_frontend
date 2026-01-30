import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const examImportSessionApi = {
  /**
   * Get all exam import sessions with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAll(params = {}) {
    return axiosClient.get(API_ENDPOINTS.EXAM_IMPORT_SESSION.LIST, { params });
  },

  /**
   * Get exam import session by ID
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  getById(sessionId) {
    return axiosClient.get(API_ENDPOINTS.EXAM_IMPORT_SESSION.DETAIL(sessionId));
  },

  /**
   * Create new exam import session
   * @param {Object} data - Session data
   * @returns {Promise}
   */
  create(data) {
    return axiosClient.post(API_ENDPOINTS.EXAM_IMPORT_SESSION.CREATE, data);
  },
};
