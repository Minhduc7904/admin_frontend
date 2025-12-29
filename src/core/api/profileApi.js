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
};
