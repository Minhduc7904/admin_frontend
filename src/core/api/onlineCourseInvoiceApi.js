import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const onlineCourseInvoiceApi = {
  getAdminList(params = {}) {
    return axiosClient.get(API_ENDPOINTS.ONLINE_COURSE_INVOICES.ADMIN_LIST, {
      params,
    });
  },

  getAdminDetail(invoiceId) {
    return axiosClient.get(
      API_ENDPOINTS.ONLINE_COURSE_INVOICES.ADMIN_DETAIL(invoiceId)
    );
  },

  confirmBankTransfer(invoiceId, data = {}) {
    return axiosClient.post(
      API_ENDPOINTS.ONLINE_COURSE_INVOICES.CONFIRM_BANK_TRANSFER(invoiceId),
      data
    );
  },
};
