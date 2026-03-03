import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const competitionApi = {
    /**
     * Get all competitions with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.examId - Exam ID filter
     * @param {string} params.visibility - Visibility filter
     * @param {number} params.createdBy - Created by admin ID filter
     * @param {string} params.startDateFrom - Start date from filter
     * @param {string} params.endDateTo - End date to filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Competitions list with pagination
     */
    getAll: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.COMPETITIONS.LIST, { params });
    },

    /**
     * Get my competitions (created by current user) with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.examId - Exam ID filter
     * @param {string} params.visibility - Visibility filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Competitions list with pagination
     */
    getMyCompetitions: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.COMPETITIONS.MY_COMPETITIONS, { params });
    },

    /**
     * Search competitions with smart permissions
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.search - Search keyword
     * @param {number} params.examId - Exam ID filter
     * @param {string} params.sortBy - Sort field
     * @param {string} params.sortOrder - Sort order (asc/desc)
     * @returns {Promise<Object>} Competitions list with pagination
     */
    search: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.COMPETITIONS.SEARCH, { params });
    },

    /**
     * Get competition by ID
     * @param {number} id - Competition ID
     * @returns {Promise<Object>} Competition data
     */
    getById: (id) => {
        return axiosClient.get(API_ENDPOINTS.COMPETITIONS.DETAIL(id));
    },

    /**
     * Create a new competition
     * @param {Object} data - Competition data
     * @param {string} data.title - Competition title
     * @param {string} data.subtitle - Competition subtitle
     * @param {number} data.examId - Exam ID
     * @param {string} data.policies - Competition policies
     * @param {string} data.startDate - Start date
     * @param {string} data.endDate - End date
     * @param {number} data.durationMinutes - Duration in minutes
     * @param {number} data.maxAttempts - Maximum attempts
     * @param {string} data.visibility - Visibility status
     * @param {boolean} data.showResultDetail - Show result detail
     * @param {boolean} data.allowLeaderboard - Allow leaderboard
     * @param {boolean} data.allowViewScore - Allow view score
     * @param {boolean} data.allowViewAnswer - Allow view answer
     * @param {boolean} data.enableAntiCheating - Enable anti-cheating
     * @returns {Promise<Object>} Created competition
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.COMPETITIONS.CREATE, data);
    },

    /**
     * Update an existing competition
     * @param {number} id - Competition ID
     * @param {Object} data - Updated competition data
     * @returns {Promise<Object>} Updated competition
     */
    update: (id, data) => {
        return axiosClient.put(API_ENDPOINTS.COMPETITIONS.UPDATE(id), data);
    },

    /**
     * Delete a competition
     * @param {number} id - Competition ID
     * @returns {Promise<Object>} Delete result
     */
    delete: (id) => {
        return axiosClient.delete(API_ENDPOINTS.COMPETITIONS.DELETE(id));
    },

    /**
     * [Admin] Thống kê đúng/sai theo từng câu hỏi của cuộc thi.
     * Chỉ tính trên các bài nộp có status = GRADED.
     * @param {number} id - Competition ID
     * @returns {Promise<Object>} Danh sách câu hỏi kèm correctCount, wrongCount, correctRate, wrongRate
     */
    getQuestionStats: (id) => {
        return axiosClient.get(API_ENDPOINTS.COMPETITIONS.QUESTION_STATS(id));
    },
};
