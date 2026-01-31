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
   * @returns {Promise}
   */
  create() {
    return axiosClient.post(API_ENDPOINTS.EXAM_IMPORT_SESSION.CREATE);
  },

  /**
   * Get raw content with presigned URLs for session
   * @param {string} sessionId - Session ID
   * @param {number} expiry - URL expiry time in seconds (default: 3600)
   * @returns {Promise}
   */
  getMyRawContent(sessionId, expiry = 3600) {
    return axiosClient.get(API_ENDPOINTS.EXAM_IMPORT_SESSION.MY_RAW_CONTENT(sessionId), {
      params: { expiry },
    });
  },

  /**
   * Update raw content for session
   * @param {string} sessionId - Session ID
   * @param {string} rawContent - New raw content
   * @returns {Promise}
   */
  updateMyRawContent(sessionId, rawContent) {
    return axiosClient.put(API_ENDPOINTS.EXAM_IMPORT_SESSION.UPDATE_MY_RAW_CONTENT(sessionId), {
      rawContent,
    });
  },
};
