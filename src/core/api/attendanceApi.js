import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const attendanceApi = {
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.ATTENDANCES.LIST, { params });
    },

    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.ATTENDANCES.DETAIL(id));
    },

    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.ATTENDANCES.CREATE, data);
    },

    createBulkBySession: (data) => {
        return axiosClient.post(API_ENDPOINTS.ATTENDANCES.CREATE_BULK_BY_SESSION, data);
    },

    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.ATTENDANCES.UPDATE(id), data);
    },

    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.ATTENDANCES.DELETE(id));
    },

    getStatisticsBySession: (sessionId) => {
        return axiosClient.get(API_ENDPOINTS.ATTENDANCES.STATISTICS_BY_SESSION(sessionId));
    },

    exportBySession: (sessionId, options = {}) => {
        return axiosClient.get(API_ENDPOINTS.ATTENDANCES.EXPORT_BY_SESSION(sessionId), {
            params: options,
            responseType: 'blob',
        });
    },

    exportImage: (id, options = {}) => {
        return axiosClient.get(API_ENDPOINTS.ATTENDANCES.EXPORT_IMAGE(id), {
            params: options,
            responseType: 'blob',
        });
    },

    toggleParentNotified: (id) => {
        return axiosClient.put(API_ENDPOINTS.ATTENDANCES.TOGGLE_PARENT_NOTIFIED(id));
    },
};
