import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const courseEnrollmentApi = {
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.COURSE_ENROLLMENTS.LIST, { params });
    },

    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.COURSE_ENROLLMENTS.DETAIL(id));
    },

    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.COURSE_ENROLLMENTS.CREATE, data);
    },

    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.COURSE_ENROLLMENTS.UPDATE(id), data);
    },

    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.COURSE_ENROLLMENTS.DELETE(id));
    },
};