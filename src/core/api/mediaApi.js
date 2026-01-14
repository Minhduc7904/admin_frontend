import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const mediaApi = {
    /**
     * Upload media file
     * @param {FormData} formData - Form data with file and metadata
     * @returns {Promise<Object>} Uploaded media data
     */
    upload: (formData) => {
        return axiosClient.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Get all media with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {number} params.folderId - Folder filter
     * @param {string} params.type - Media type filter (IMAGE, VIDEO, AUDIO, DOCUMENT, OTHER)
     * @param {string} params.status - Media status filter (UPLOADING, READY, FAILED, DELETED)
     * @param {number} params.uploadedBy - Uploader user ID filter
     * @param {string} params.bucketName - Bucket name filter
     * @param {string} params.sortBy - Sort field (createdAt, fileSize, filename)
     * @param {string} params.sortOrder - Sort order (asc, desc)
     * @returns {Promise<Object>} Media list with total count
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA.LIST, { params });
    },

    /**
     * Get all available buckets
     * @returns {Promise<Object>} Buckets list
     */
    getBuckets: () => {
        return axiosClient.get(`${API_ENDPOINTS.MEDIA.LIST}/buckets`);
    },

    /**
     * Get media by ID
     * @param {number} id - Media ID
     * @returns {Promise<Object>} Media data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA.DETAIL(id));
    },

    /**
     * Get download URL for media
     * @param {number} id - Media ID
     * @param {number} expiry - URL expiry in seconds (default: 3600 = 1 hour)
     * @returns {Promise<Object>} Download URL with expiry info
     */
    getDownloadUrl: (id, expiry = 3600) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA.DOWNLOAD(id), {
            params: { expiry },
        });
    },

    /**
     * Get view URL for media (opens inline in browser)
     * @param {number} id - Media ID
     * @param {number} expiry - URL expiry in seconds (default: 3600 = 1 hour)
     * @returns {Promise<Object>} View URL with expiry info
     */
    getViewUrl: (id, expiry = 3600) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA.VIEW(id), {
            params: { expiry },
        });
    },

    /**
     * Get view URLs for multiple media files (opens inline in browser)
     * @param {number[]} mediaIds - Array of media IDs (max 100)
     * @param {number} expiry - URL expiry in seconds (default: 3600 = 1 hour)
     * @returns {Promise<Object>} View URLs with expiry info and error handling
     */
    getBatchViewUrl: (mediaIds, expiry = 3600) => {
        return axiosClient.post(API_ENDPOINTS.MEDIA.BATCH_VIEW, 
            { mediaIds },
            { params: { expiry } }
        );
    },

    /**
     * Update media metadata
     * @param {number} id - Media ID
     * @param {Object} data - Media data to update
     * @param {number} data.folderId - Folder ID
     * @param {string} data.description - Description
     * @param {string} data.alt - Alt text
     * @returns {Promise<Object>} Updated media
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.MEDIA.UPDATE(id), data);
    },

    /**
     * Soft delete media (marks as DELETED)
     * @param {number} id - Media ID
     * @returns {Promise<Object>} Delete result
     */
    softDelete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.MEDIA.DELETE(id));
    },

    /**
     * Hard delete media (permanently removes from storage)
     * WARNING: This action cannot be undone
     * @param {number} id - Media ID
     * @returns {Promise<Object>} Delete result
     */
    hardDelete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.MEDIA.HARD_DELETE(id));
    },
};
