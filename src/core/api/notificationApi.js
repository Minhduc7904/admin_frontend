// src/core/api/notificationApi.ts

import axiosClient from './axiosClient'
import { API_ENDPOINTS } from '../constants'

export const notificationApi = {
    /**
     * Get notifications of current user
     * 
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {boolean} params.isRead - Filter by read status
     * @param {string} params.type - Notification type filter
     * @returns {Promise<Object>} Paginated notifications
     * 
     * GET /notifications/my
     */
    getMy: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.NOTIFICATIONS.MY, { params })
    },

    /**
     * Get notification statistics of current user
     * 
     * @returns {Promise<Object>} Notification stats (total, unread, read)
     * 
     * GET /notifications/my/stats
     */
    getMyStats: () => {
        return axiosClient.get(API_ENDPOINTS.NOTIFICATIONS.MY_STATS)
    },

    /**
     * Mark all notifications as read for current user
     * 
     * @returns {Promise<Object>} Count of marked notifications
     * 
     * PUT /notifications/my/mark-all-read
     */
    markAllRead: () => {
        return axiosClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    },

    /**
     * Mark a specific notification as read
     * 
     * @param {number} id - Notification ID
     * @returns {Promise<Object>} Updated notification
     * 
     * PUT /notifications/:id/mark-read
     */
    markRead: (id) => {
        return axiosClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
    },

    /**
     * Delete a specific notification
     * 
     * @param {number} id - Notification ID
     * @returns {Promise<Object>} Delete result
     * 
     * DELETE /notifications/:id
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id))
    },

    /**
     * Get notifications of a specific user (admin only)
     * 
     * @param {number} userId - Target user ID
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {boolean} params.isRead - Filter by read status
     * @returns {Promise<Object>} Paginated notifications
     * 
     * GET /notifications/user/:userId
     */
    getByUserId: (userId, params = {}) => {
        return axiosClient.get(
            API_ENDPOINTS.NOTIFICATIONS.BY_USER(userId),
            { params }
        )
    },

    /**
     * Send notification to users / role / all users
     * 
     * @param {Object} data - Notification payload
     * @param {string} data.title - Notification title
     * @param {string} data.message - Notification message
     * @param {string} data.type - Notification type
     * @param {string} data.level - Notification level
     * 
     * // Target options (choose ONE)
     * @param {number[]} [data.userIds] - Specific user IDs
     * @param {string} [data.role] - Target role (ADMIN | STUDENT)
     * @param {boolean} [data.all] - Send to all users
     * 
     * @param {Object} [data.data] - Extra metadata (entity, url, etc.)
     * 
     * @returns {Promise<Object>} Count of notifications sent
     * 
     * POST /notifications/send
     */
    send: (data) => {
        return axiosClient.post(API_ENDPOINTS.NOTIFICATIONS.SEND, data)
    },
}
