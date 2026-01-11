import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const mediaFolderApi = {
    /**
     * Create a new media folder
     * @param {Object} data - Folder data
     * @param {string} data.name - Folder name
     * @param {number} data.parentId - Parent folder ID (optional)
     * @param {string} data.description - Description (optional)
     * @returns {Promise<Object>} Created folder
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.MEDIA_FOLDERS.CREATE, data);
    },

    /**
     * Get all media folders with filtering
     * @param {Object} params - Query parameters
     * @param {number} params.skip - Skip items
     * @param {number} params.take - Items to take
     * @param {number} params.parentId - Parent folder filter
     * @returns {Promise<Object>} Folder list with total count
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA_FOLDERS.LIST, { params });
    },

    /**
     * Get root folders (folders without parent)
     * @param {Object} params - Query parameters
     * @param {string} params.type - Media type filter for mediaCount
     * @returns {Promise<Array>} Root folder list
     */
    getRoots: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA_FOLDERS.ROOTS, { params });
    },

    /**
     * Get folder by ID
     * @param {number} id - Folder ID
     * @returns {Promise<Object>} Folder data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA_FOLDERS.DETAIL(id));
    },

    /**
     * Get direct children of a folder
     * @param {number} id - Folder ID
     * @param {Object} params - Query parameters
     * @param {string} params.type - Media type filter for mediaCount
     * @returns {Promise<Array>} Child folder list
     */
    getChildren: (id, params = {}) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA_FOLDERS.CHILDREN(id), { params });
    },

    /**
     * Update media folder
     * @param {number} id - Folder ID
     * @param {Object} data - Folder data to update
     * @param {string} data.name - Folder name
     * @param {number} data.parentId - Parent folder ID
     * @param {string} data.description - Description
     * @returns {Promise<Object>} Updated folder
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.MEDIA_FOLDERS.UPDATE(id), data);
    },

    /**
     * Delete media folder (cascade deletes children)
     * @param {number} id - Folder ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.MEDIA_FOLDERS.DELETE(id));
    },
};
