import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const profileApi = {
  /**
   * Get current admin profile
   * @returns {Promise<Object>} Admin profile data
   */
  getProfile: () => {
    return axiosClient.get(API_ENDPOINTS.PROFILE.GET);
  },

  /**
   * Update admin profile
   * @param {Object} data - Profile data to update
   * @returns {Promise}
   */
  updateProfile: (data) => {
    return axiosClient.put(API_ENDPOINTS.PROFILE.UPDATE, data);
  },

  /**
   * Upload admin avatar
   * @param {File} file - Avatar file
   * @returns {Promise}
   */
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosClient.post(API_ENDPOINTS.PROFILE.UPLOAD_AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
