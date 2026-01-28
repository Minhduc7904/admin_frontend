import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const courseApi = {
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.COURSES.LIST, { params });
    },

    getMyCourses: (params) => {
        return axiosClient.get(API_ENDPOINTS.COURSES.MY_COURSES, { params });
    },

    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.COURSES.DETAIL(id));
    },

    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.COURSES.CREATE, data);
    },

    updateBasicInfo: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.COURSES.UPDATE_BASIC_INFO(id), data);
    },

    updatePricing: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.COURSES.UPDATE_PRICING(id), data);
    },

    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.COURSES.DELETE(id));
    },

    getStudentsAttendance: (id, params) => {
        return axiosClient.get(API_ENDPOINTS.COURSES.STUDENTS_ATTENDANCE(id), { params });
    },

    exportStudentsAttendance: (id, params = {}) => {
        return axiosClient.get(API_ENDPOINTS.COURSES.STUDENTS_ATTENDANCE_EXPORT(id), {
            params,
            responseType: 'blob',
        });
    },
};