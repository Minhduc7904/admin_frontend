import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const courseClassApi = {
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.COURSE_CLASSES.LIST, { params });
    },

    search: (params) => {
        return axiosClient.get(API_ENDPOINTS.COURSE_CLASSES.SEARCH, { params });
    },

    getMyClasses: (params) => {
        return axiosClient.get(API_ENDPOINTS.COURSE_CLASSES.MY_CLASSES, { params });
    },

    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.COURSE_CLASSES.DETAIL(id));
    },

    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.COURSE_CLASSES.CREATE, data);
    },

    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.COURSE_CLASSES.UPDATE(id), data);
    },

    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.COURSE_CLASSES.DELETE(id));
    },
};