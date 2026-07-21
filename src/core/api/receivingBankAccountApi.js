import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const receivingBankAccountApi = {
  getAll(params = {}) {
    return axiosClient.get(API_ENDPOINTS.RECEIVING_BANK_ACCOUNTS.LIST, { params });
  },

  create(data) {
    return axiosClient.post(API_ENDPOINTS.RECEIVING_BANK_ACCOUNTS.CREATE, data);
  },

  update(id, data) {
    return axiosClient.put(API_ENDPOINTS.RECEIVING_BANK_ACCOUNTS.UPDATE(id), data);
  },

  activate(id) {
    return axiosClient.post(API_ENDPOINTS.RECEIVING_BANK_ACCOUNTS.ACTIVATE(id));
  },

  deactivate(id) {
    return axiosClient.post(API_ENDPOINTS.RECEIVING_BANK_ACCOUNTS.DEACTIVATE(id));
  },

  syncFromSepay() {
    return axiosClient.post(API_ENDPOINTS.RECEIVING_BANK_ACCOUNTS.SYNC_FROM_SEPAY);
  },

  getSepayBalance(id) {
    return axiosClient.get(API_ENDPOINTS.RECEIVING_BANK_ACCOUNTS.SEPAY_BALANCE(id));
  },
};
