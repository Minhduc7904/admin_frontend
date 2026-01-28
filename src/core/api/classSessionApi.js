import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const classSessionApi = {
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.CLASS_SESSIONS.LIST, { params });
    },

    search: (params) => {
        return axiosClient.get(API_ENDPOINTS.CLASS_SESSIONS.SEARCH, { params });
    },

    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.CLASS_SESSIONS.DETAIL(id));
    },

    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.CLASS_SESSIONS.CREATE, data);
    },

    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.CLASS_SESSIONS.UPDATE(id), data);
    },

    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.CLASS_SESSIONS.DELETE(id));
    },
};