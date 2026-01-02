import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const roleApi = {
  /**
   * Get all roles with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Items per page
   * @param {number} params.offset - Offset
   * @returns {Promise<Object>} Roles list
   */
  getAll: (params = {}) => {
    return axiosClient.get(API_ENDPOINTS.ROLES.LIST, { params });
  },

  /**
   * Get role by ID
   * @param {number} id - Role ID
   * @returns {Promise<Object>} Role data
   */
  getById: (id) => {
    return axiosClient.get(API_ENDPOINTS.ROLES.DETAIL(id));
  },

  /**
   * Create a new role
   * @param {Object} data - Role data
   * @param {string} data.code - Role code
   * @param {string} data.name - Role name
   * @param {string} data.description - Role description
   * @param {number[]} data.permissionIds - Permission IDs to assign
   * @returns {Promise<Object>} Created role
   */
  create: (data) => {
    return axiosClient.post(API_ENDPOINTS.ROLES.CREATE, data);
  },

  /**
   * Update role
   * @param {number} id - Role ID
   * @param {Object} data - Role data to update
   * @returns {Promise<Object>} Updated role
   */
  update: (id, data) => {
    return axiosClient.put(API_ENDPOINTS.ROLES.UPDATE(id), data);
  },

  /**
   * Delete role
   * @param {number} id - Role ID
   * @returns {Promise<Object>} Delete result
   */
  delete: (id) => {
    return axiosClient.delete(API_ENDPOINTS.ROLES.DELETE(id));
  },

  /**
   * Assign role to user
   * @param {Object} data - Assignment data
   * @param {number} data.userId - User ID
   * @param {number} data.roleId - Role ID to assign
   * @returns {Promise<Object>} Assignment result
   */
  assignToUser: (data) => {
    return axiosClient.post(API_ENDPOINTS.ROLES.ASSIGN, data);
  },

  /**
   * Remove role from user
   * @param {Object} data - Removal data
   * @param {number} data.userId - User ID
   * @param {number} data.roleId - Role ID to remove
   * @returns {Promise<Object>} Removal result
   */
  removeFromUser: ({ userId, roleId }) => {
    return axiosClient.delete(API_ENDPOINTS.ROLES.REMOVE_FROM_USER(userId, roleId));
  },

  /**
   * Get user roles
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User's roles
   */
  getUserRoles: (userId) => {
    return axiosClient.get(API_ENDPOINTS.ROLES.USER_ROLES(userId));
  },

  /**
   * Toggle permission in role (add if not exists, remove if exists)
   * @param {number} roleId - Role ID
   * @param {number} permissionId - Permission ID
   * @returns {Promise<Object>} Toggle result with action ('added' or 'removed')
   */
  togglePermission: (roleId, permissionId) => {
    return axiosClient.post(API_ENDPOINTS.ROLES.TOGGLE_PERMISSION(roleId, permissionId));
  },
};
