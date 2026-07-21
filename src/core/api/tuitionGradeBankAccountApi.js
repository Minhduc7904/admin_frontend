import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const tuitionGradeBankAccountApi = {
  getAll() {
    return axiosClient.get(API_ENDPOINTS.TUITION_GRADE_BANK_ACCOUNTS.LIST);
  },

  update(data) {
    return axiosClient.put(API_ENDPOINTS.TUITION_GRADE_BANK_ACCOUNTS.UPDATE, data);
  },
};
