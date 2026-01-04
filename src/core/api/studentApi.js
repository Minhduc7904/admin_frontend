import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const studentApi = {
    /**
     * Get all students with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @param {string} params.grade - Grade filter
     * @param {boolean} params.isActive - Active status filter
     * @returns {Promise<Object>} Students list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.STUDENTS.LIST, { params });
    },

    /**
     * Get student by ID
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Student details
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.STUDENTS.DETAIL(id));
    },

    /**
     * Create new student
     * @param {Object} data - Student data
     * @returns {Promise<Object>} Created student
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.STUDENTS.CREATE, data);
    },

    /**
     * Update student
     * @param {number} id - Student ID
     * @param {Object} data - Updated student data
     * @returns {Promise<Object>} Updated student
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.STUDENTS.UPDATE(id), data);
    },

    /**
     * Delete student
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Delete response
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.STUDENTS.DELETE(id));
    },

    /**
     * Get current student profile (for student role)
     * @returns {Promise<Object>} Current student profile
     */
    getMyProfile: () => {
        return axiosClient.get("/students/me");
    },

    /**
     * Update current student profile (for student role)
     * @param {Object} data - Updated profile data
     * @returns {Promise<Object>} Updated profile
     */
    updateMyProfile: (data) => {
        return axiosClient.put("/students/me", data);
    }
};