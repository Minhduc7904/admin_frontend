import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const coursePaymentConfigurationApi = {
  get() {
    return axiosClient.get(API_ENDPOINTS.COURSE_PAYMENT_CONFIGURATION.GET);
  },

  update(data) {
    return axiosClient.put(API_ENDPOINTS.COURSE_PAYMENT_CONFIGURATION.UPDATE, data);
  },
};
