import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const permissionApi = {
    /**
     * Get all permissions with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {string} params.group - Permission group filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Permissions list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.PERMISSIONS.LIST, { params });
    },

    /**
     * Get all distinct permission groups
     * @returns {Promise<Object>} List of permission groups
     */
    getGroups: () => {
        return axiosClient.get(API_ENDPOINTS.PERMISSIONS.GROUPS);
    },

    /**
     * Get permission by ID
     * @param {number} id - Permission ID
     * @returns {Promise<Object>} Permission data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.PERMISSIONS.DETAIL(id));
    },

    /**
     * Create a new permission
     * @param {Object} data - Permission data
     * @param {string} data.code - Permission code
     * @param {string} data.name - Permission name
     * @param {string} data.description - Permission description
     * @param {string} data.group - Permission group
     * @returns {Promise<Object>} Created permission
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.PERMISSIONS.CREATE, data);
    },

    /**
     * Update permission
     * @param {number} id - Permission ID
     * @param {Object} data - Permission data to update
     * @returns {Promise<Object>} Updated permission
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.PERMISSIONS.UPDATE(id), data);
    },

    /**
     * Delete permission
     * @param {number} id - Permission ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.PERMISSIONS.DELETE(id));
    },
};
