import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const homeworkSubmitApi = {
    /**
     * Get all homework submits with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.homeworkContentId - Filter by homework content ID
     * @param {number} params.studentId - Filter by student ID
     * @param {number} params.graderId - Filter by grader ID
     * @param {boolean} params.isGraded - Filter by graded status
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Homework submits list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_SUBMITS.LIST, { params });
    },

    /**
     * Get paginated homework submits of one student for admin student detail tabs.
     * @param {number} studentId - Student ID
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Student homework submits with pagination
     */
    getByStudent: (studentId, params = {}) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_SUBMITS.BY_STUDENT(studentId), { params });
    },

    /**
     * Get homework submit by ID
     * @param {number} id - Homework submit ID
     * @returns {Promise<Object>} Homework submit data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_SUBMITS.DETAIL(id));
    },

    /**
     * Get the admin detail used to review a submission. File submissions include
     * presigned attachment URLs; competition submissions include answers/results.
     */
    getAdminDetail: (id) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_SUBMITS.ADMIN_DETAIL(id));
    },

    /**
     * Create a new homework submit
     * @param {Object} data - Homework submit data
     * @param {number} data.homeworkContentId - Homework content ID
     * @param {number} data.studentId - Student ID
     * @param {string} data.content - Submit content/answer
     * @returns {Promise<Object>} Created homework submit
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.HOMEWORK_SUBMITS.CREATE, data);
    },

    /** Create (or replace) a homework submit from a student's submitted competition attempt. */
    createFromCompetition: (data) => {
        return axiosClient.post(API_ENDPOINTS.HOMEWORK_SUBMITS.FROM_COMPETITION, data);
    },

    /** Get submitted competition attempts that can be linked for one student. */
    getStudentCompetitionAttempts: (studentId) => {
        return axiosClient.get(API_ENDPOINTS.HOMEWORK_SUBMITS.COMPETITION_ATTEMPTS(studentId));
    },

    /** Replace the competition attempt linked to an existing homework submit. */
    updateCompetitionSubmit: (id, data) => {
        return axiosClient.patch(API_ENDPOINTS.HOMEWORK_SUBMITS.UPDATE_COMPETITION_SUBMIT(id), data);
    },

    /**
     * Update homework submit
     * @param {number} id - Homework submit ID
     * @param {Object} data - Homework submit data to update
     * @returns {Promise<Object>} Updated homework submit
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.HOMEWORK_SUBMITS.UPDATE(id), data);
    },

    /**
     * Grade a homework submit
     * @param {number} id - Homework submit ID
     * @param {Object} data - Grading data
     * @param {number} data.points - Points awarded
     * @param {string} data.feedback - Grading feedback (optional)
     * @returns {Promise<Object>} Graded homework submit
     */
    grade: (id, data) => {
        return axiosClient.patch(API_ENDPOINTS.HOMEWORK_SUBMITS.ADMIN_GRADE(id), data);
    },

    /** Remove the manual grade from a file homework submission. */
    ungrade: (id) => {
        return axiosClient.patch(API_ENDPOINTS.HOMEWORK_SUBMITS.ADMIN_UNGRADE(id));
    },

    /** Update the teacher's feedback for an image attached to a file homework submission. */
    updateMediaAlt: (homeworkSubmitId, mediaId, data) => {
        return axiosClient.patch(
            API_ENDPOINTS.HOMEWORK_SUBMITS.ADMIN_UPDATE_MEDIA_ALT(homeworkSubmitId, mediaId),
            data,
        );
    },

    /**
     * Delete homework submit
     * @param {number} id - Homework submit ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.HOMEWORK_SUBMITS.DELETE(id));
    },
};
