import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const mediaUsageApi = {
    /**
     * Attach media to an entity
     * @param {Object} data - Attachment data
     * @param {number} data.mediaId - Media ID
     * @param {string} data.entityType - Entity type (e.g., 'User', 'Post', 'Product')
     * @param {number} data.entityId - Entity ID
     * @param {string} data.context - Usage context (e.g., 'avatar', 'thumbnail', 'gallery')
     * @param {number} data.order - Display order (optional)
     * @returns {Promise<Object>} Created media usage
     */
    attach: (data) => {
        return axiosClient.post(API_ENDPOINTS.MEDIA_USAGES.ATTACH, data);
    },

    /**
     * Get all media usages with filtering
     * @param {Object} params - Query parameters
     * @param {number} params.skip - Skip items
     * @param {number} params.take - Items to take
     * @param {number} params.mediaId - Media filter
     * @param {string} params.entityType - Entity type filter
     * @param {number} params.entityId - Entity ID filter
     * @param {string} params.context - Context filter
     * @returns {Promise<Object>} Media usage list with total count
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA_USAGES.LIST, { params });
    },

    /**
     * Get all usages of a specific media
     * @param {number} mediaId - Media ID
     * @returns {Promise<Array>} Media usage list
     */
    getByMedia: (mediaId) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA_USAGES.BY_MEDIA(mediaId));
    },

    /**
     * Get all media attached to a specific entity
     * @param {string} entityType - Entity type
     * @param {number} entityId - Entity ID
     * @returns {Promise<Array>} Media usage list with media details
     */
    getByEntity: (entityType, entityId) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA_USAGES.BY_ENTITY(entityType, entityId));
    },

    /**
     * Detach media by usage ID
     * @param {number} id - Media usage ID
     * @returns {Promise<Object>} Detach result
     */
    detach: (id) => {
        return axiosClient.delete(API_ENDPOINTS.MEDIA_USAGES.DELETE(id));
    },

    /**
     * Detach all media from an entity
     * @param {string} entityType - Entity type
     * @param {number} entityId - Entity ID
     * @returns {Promise<Object>} Detach result with count
     */
    detachByEntity: (entityType, entityId) => {
        return axiosClient.delete(API_ENDPOINTS.MEDIA_USAGES.DELETE_BY_ENTITY(entityType, entityId));
    },
};
