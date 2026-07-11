import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const studentPointLogApi = {
    getByStudent: (studentId, params) => {
        return axiosClient.get(API_ENDPOINTS.STUDENT_POINT_LOGS.BY_STUDENT(studentId), { params });
    },

    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.STUDENT_POINT_LOGS.CREATE, data);
    },

    update: (pointLogId, data) => {
        return axiosClient.put(API_ENDPOINTS.STUDENT_POINT_LOGS.UPDATE(pointLogId), data);
    },

    delete: (pointLogId) => {
        return axiosClient.delete(API_ENDPOINTS.STUDENT_POINT_LOGS.DELETE(pointLogId));
    },
};
