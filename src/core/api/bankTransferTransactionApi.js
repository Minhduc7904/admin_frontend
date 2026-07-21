import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const bankTransferTransactionApi = {
  getAll(params = {}) {
    return axiosClient.get(API_ENDPOINTS.BANK_TRANSFER_TRANSACTIONS.LIST, { params });
  },

  getById(id) {
    return axiosClient.get(API_ENDPOINTS.BANK_TRANSFER_TRANSACTIONS.DETAIL(id));
  },

  getStatistics(params = {}) {
    return axiosClient.get(API_ENDPOINTS.BANK_TRANSFER_TRANSACTIONS.STATISTICS, { params });
  },

  getForTuitionPayment(tuitionPaymentId, params = {}) {
    return axiosClient.get(API_ENDPOINTS.BANK_TRANSFER_TRANSACTIONS.FOR_TUITION_PAYMENT(tuitionPaymentId), { params });
  },

  syncSepay() {
    return axiosClient.post(API_ENDPOINTS.BANK_TRANSFER_TRANSACTIONS.SYNC_SEPAY);
  },
};
