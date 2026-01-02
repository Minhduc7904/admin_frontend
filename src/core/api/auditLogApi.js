import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const auditLogApi = {
  /**
   * Get all audit logs with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10, max: 100)
   * @param {string} params.search - Search keyword (actionKey, resourceType, resourceId)
   * @param {number} params.adminId - Filter by admin ID
   * @param {string} params.actionKey - Filter by action key
   * @param {string} params.resourceType - Filter by resource type
   * @param {string} params.resourceId - Filter by resource ID
   * @param {string} params.status - Filter by status (SUCCESS, FAIL, ROLLBACK)
   * @param {string} params.fromDate - Start date (ISO 8601 format)
   * @param {string} params.toDate - End date (ISO 8601 format)
   * @param {string} params.sortBy - Sort field (default: createdAt)
   * @param {string} params.sortOrder - Sort order: asc or desc (default: desc)
   * @returns {Promise<Object>} Audit logs list with pagination
   */
  getAll: (params = {}) => {
    return axiosClient.get(API_ENDPOINTS.AUDIT_LOGS.LIST, { params });
  },

  /**
   * Get audit log by ID
   * @param {number} id - Audit log ID
   * @returns {Promise<Object>} Audit log data
   */
  getById: (id) => {
    return axiosClient.get(API_ENDPOINTS.AUDIT_LOGS.DETAIL(id));
  },

  /**
   * Rollback a specific audit log
   * @param {number} id - Audit log ID
   * @returns {Promise<Object>} Rollback result
   */
  rollback: (id) => {
    return axiosClient.post(API_ENDPOINTS.AUDIT_LOGS.ROLLBACK(id));
  },
};
