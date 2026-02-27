import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const competitionSubmitApi = {
    /**
     * GET /competition-submits
     * Lấy danh sách bài nộp có phân trang, lọc theo:
     * competitionId, studentId, status, attemptNumber, isGraded, startedFrom/To
     * @param {Object} params
     * @param {number}  [params.page]
     * @param {number}  [params.limit]
     * @param {number}  [params.competitionId]
     * @param {number}  [params.studentId]
     * @param {string}  [params.status]        - e.g. 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED'
     * @param {number}  [params.attemptNumber]
     * @param {boolean} [params.isGraded]
     * @param {string}  [params.startedFrom]   - ISO date string
     * @param {string}  [params.startedTo]     - ISO date string
     * @param {string}  [params.sortBy]
     * @param {string}  [params.sortOrder]     - 'asc' | 'desc'
     * @returns {Promise}
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.COMPETITION_SUBMITS.LIST, { params });
    },

    /**
     * GET /competition-submits/:id
     * Lấy chi tiết 1 bài nộp theo ID (bao gồm answers nếu có)
     * @param {number} id - Competition submit ID
     * @returns {Promise}
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.COMPETITION_SUBMITS.DETAIL(id));
    },

    /**
     * DELETE /competition-submits/:id
     * Xoá bài nộp (admin only, ghi audit log)
     * @param {number} id - Competition submit ID
     * @returns {Promise}
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.COMPETITION_SUBMITS.DELETE(id));
    },
};
