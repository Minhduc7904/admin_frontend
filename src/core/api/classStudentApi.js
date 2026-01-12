import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const classStudentApi = {
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.CLASS_STUDENTS.LIST, { params });
    },

    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.CLASS_STUDENTS.DETAIL(id));
    },

    add: (data) => {
        return axiosClient.post(API_ENDPOINTS.CLASS_STUDENTS.CREATE, data);
    },

    remove: ({ classId, studentId }) => {
        return axiosClient.delete(API_ENDPOINTS.CLASS_STUDENTS.DELETE(classId, studentId));
    },
};