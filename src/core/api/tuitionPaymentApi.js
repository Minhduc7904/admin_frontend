import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const tuitionPaymentApi = {
  /* ========================= Stats ========================= */
  getStatsByMoney(params = {}) {
    return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENT.STATS_BY_MONEY, {
      params,
    });
  },

  getStatsByStatus(params = {}) {
    return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENT.STATS_BY_STATUS, {
      params,
    });
  },

  getAll(params = {}) {
    return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENT.LIST, { params });
  },

  getByCourseId(courseId, params = {}) {
    return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENT.BY_COURSE(courseId), {
      params,
    });
  },

  getByStudentId(studentId, params = {}) {
    return axiosClient.get(
      API_ENDPOINTS.TUITION_PAYMENT.BY_STUDENT(studentId),
      { params }
    );
  },

  getById(id) {
    return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENT.DETAIL(id));
  },

  create(data) {
    return axiosClient.post(API_ENDPOINTS.TUITION_PAYMENT.CREATE, data);
  },

  createBulk(data) {
    return axiosClient.post(API_ENDPOINTS.TUITION_PAYMENT.CREATE_BULK, data);
  },

  update(id, data) {
    return axiosClient.put(API_ENDPOINTS.TUITION_PAYMENT.UPDATE(id), data);
  },

  delete(id) {
    return axiosClient.delete(API_ENDPOINTS.TUITION_PAYMENT.DELETE(id));
  },

  exportExcelExample(params = {}) {
    return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENT.EXPORT_EXCEL_EXAMPLE, {
      params,
      responseType: "blob",
    });
  },

  importExcelPreview(formData) {
    return axiosClient.post(API_ENDPOINTS.TUITION_PAYMENT.IMPORT_EXCEL_PREVIEW, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
