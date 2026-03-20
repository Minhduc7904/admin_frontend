import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const superAdminApi = {
    /**
     * Reset password for students created within a date range.
     * New password equals the student's phone number.
     * POST /super-admin/reset-password-by-date-range
     */
    resetPasswordByDateRange: (data) => {
        return axiosClient.post(API_ENDPOINTS.SUPER_ADMIN.RESET_PASSWORD_BY_DATE_RANGE, data);
    },

    /**
     * Update Admin and its User data directly.
     * POST /super-admin/update-admin-direct
     */
    updateAdminDirect: (data) => {
        return axiosClient.post(API_ENDPOINTS.SUPER_ADMIN.UPDATE_ADMIN_DIRECT, data);
    },

    /**
     * Find and delete all media that has no usage and was created more than 30 days ago.
     * POST /super-admin/cleanup-unused-media-older-than-30-days
     */
    cleanupUnusedMediaOlderThan30Days: (data = {}) => {
        return axiosClient.post(
            API_ENDPOINTS.SUPER_ADMIN.CLEANUP_UNUSED_MEDIA_OLDER_THAN_30_DAYS,
            data
        );
    },
};
