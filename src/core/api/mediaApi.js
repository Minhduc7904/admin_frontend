import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const mediaApi = {
    /* =========================
     * Upload
     * ========================= */
    upload(formData) {
        return axiosClient.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    getPresignedUploadUrl({
        originalFilename,
        mimeType,
        fileSize,
        type,
        folderId = null,
        width = null,
        height = null,
        duration = null,
    }) {
        return axiosClient.post(API_ENDPOINTS.MEDIA.GET_PRESIGNED_UPLOAD_URL, {
            originalFilename,
            mimeType,
            fileSize,
            type,
            folderId,
            width,
            height,
            duration,
        });
    },

    postUploadComplete({ mediaId, etag = null, uploadedSize = null }) {
        return axiosClient.post(API_ENDPOINTS.MEDIA.UPLOAD_COMPLETE, {
            mediaId,
            etag,
            uploadedSize,
        });
    },

    /* =========================
     * List
     * ========================= */
    getAll(params = {}) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.LIST, { params });
    },

    getMy(params = {}) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.MY_LIST, { params });
    },

    /* =========================
     * Buckets
     * ========================= */
    getBuckets() {
        return axiosClient.get(API_ENDPOINTS.MEDIA.BUCKETS);
    },

    /* =========================
     * Detail
     * ========================= */
    getById(id) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.DETAIL(id));
    },

    /* =========================
     * View / Download (public)
     * ========================= */
    getViewUrl(id, expiry = 3600, context = {}) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.VIEW(id), {
            params: { expiry, ...context },
        });
    },

    getAdminViewUrl(id, expiry = 3600) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.ADMIN_VIEW(id), {
            params: { expiry },
        });
    },

    getDownloadUrl(id, expiry = 3600, context = {}) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.DOWNLOAD(id), {
            params: { expiry, ...context },
        });
    },

    getAdminDownloadUrl(id, expiry = 3600) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.ADMIN_DOWNLOAD(id), {
            params: { expiry },
        });
    },

    /* =========================
     * View / Download (my media)
     * ========================= */
    getMyViewUrl(id, expiry = 3600) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.MY_VIEW(id), {
            params: { expiry },
        });
    },

    getMyDownloadUrl(id, expiry = 3600) {
        return axiosClient.get(API_ENDPOINTS.MEDIA.MY_DOWNLOAD(id), {
            params: { expiry },
        });
    },

    /* =========================
     * Batch
     * ========================= */
    getBatchMyViewUrl(mediaIds, expiry = 3600) {
        return axiosClient.post(
            API_ENDPOINTS.MEDIA.BATCH_MY_VIEW,
            { mediaIds },
            { params: { expiry } }
        );
    },

    /* =========================
     * Update
     * ========================= */
    update(id, data) {
        return axiosClient.put(API_ENDPOINTS.MEDIA.UPDATE(id), data);
    },

    /* =========================
     * Delete
     * ========================= */
    softDelete(id) {
        return axiosClient.delete(API_ENDPOINTS.MEDIA.DELETE(id));
    },

    softDeleteByUser(id) {
        return axiosClient.delete(API_ENDPOINTS.MEDIA.SOFT_DELETE_BY_USER(id));
    },

    hardDelete(id) {
        return axiosClient.delete(API_ENDPOINTS.MEDIA.HARD_DELETE(id));
    },

    /**
     * Get bucket statistics (file count and total size for all buckets)
     * @returns {Promise<Object>} Bucket statistics with file count and sizes
     */
    getBucketStatistics: () => {
        return axiosClient.get(API_ENDPOINTS.MEDIA.BUCKET_STATISTICS);
    },

    /**
     * Extract text from PDF or image using Mistral AI OCR
     * @param {number} id - Media ID
     * @param {Object} options - Extraction options
     * @param {boolean} options.includeImageBase64 - Include image base64 in response
     * @returns {Promise<Object>} Extracted text with metadata
     */
    extractText: (id, options = {}) => {
        return axiosClient.post(API_ENDPOINTS.MEDIA.EXTRACT_TEXT(id), options);
    },

    /**
     * Get raw content with presigned URLs (Admin)
     * @param {number} id - Media ID
     * @param {number} expiry - URL expiry in seconds (default: 3600)
     * @returns {Promise<Object>} Raw content with processed URLs
     */
    getAdminRawContent: (id, expiry = 3600) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA.ADMIN_RAW_CONTENT(id), {
            params: { expiry },
        });
    },

    /**
     * Get raw content with presigned URLs (My Media)
     * @param {number} id - Media ID
     * @param {number} expiry - URL expiry in seconds (default: 3600)
     * @returns {Promise<Object>} Raw content with processed URLs
     */
    getMyRawContent: (id, expiry = 3600) => {
        return axiosClient.get(API_ENDPOINTS.MEDIA.MY_RAW_CONTENT(id), {
            params: { expiry },
        });
    },
};
