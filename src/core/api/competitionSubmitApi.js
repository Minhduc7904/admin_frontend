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

    /**     * GET /competition-submits/:id/detail
     * [Admin] Lấy chi tiết đầy đủ bài nộp cuộc thi:
     * - Thông tin bài nộp (status, điểm, thời gian…)
     * - student, competition
     * - answers[]: câu trả lời kèm question, statements, isCorrect, points
     * - totalAnswers, correctAnswers, incorrectAnswers, unansweredQuestions
     * @param {number} id - Competition submit ID
     * @returns {Promise<AdminCompetitionSubmitDetailResponseDto>}
     */
    getDetail: (id) => {
        return axiosClient.get(API_ENDPOINTS.COMPETITION_SUBMITS.FULL_DETAIL(id));
    },

    /**
     * POST /competition-submits/:id/regrade
     * [Admin] Chấm điểm lại bài nộp cuộc thi.
     * @param {number} id - Competition submit ID
     * @returns {Promise}
     */
    regrade: (id) => {
        return axiosClient.post(API_ENDPOINTS.COMPETITION_SUBMITS.REGRADE(id));
    },

    /**     * DELETE /competition-submits/:id
     * Xoá bài nộp (admin only, ghi audit log)
     * @param {number} id - Competition submit ID
     * @returns {Promise}
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.COMPETITION_SUBMITS.DELETE(id));
    },
};
