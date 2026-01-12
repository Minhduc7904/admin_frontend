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
};
