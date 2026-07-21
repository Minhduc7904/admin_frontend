import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const paymentIntentApi = {
  createForTuitionPayment: (tuitionPaymentId) => axiosClient.post(
    API_ENDPOINTS.PAYMENT_INTENTS.CREATE_FOR_TUITION_PAYMENT(tuitionPaymentId),
  ),
  createBulkForGradePeriod: (data) => axiosClient.post(API_ENDPOINTS.PAYMENT_INTENTS.CREATE_BULK, data),
};
