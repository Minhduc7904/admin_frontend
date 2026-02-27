import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const examImportSessionApi = {
  /**
   * Get all exam import sessions with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAll(params = {}) {
    return axiosClient.get(API_ENDPOINTS.EXAM_IMPORT_SESSION.LIST, { params });
  },

  /**
   * Get exam import session by ID
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  getById(sessionId) {
    return axiosClient.get(API_ENDPOINTS.EXAM_IMPORT_SESSION.DETAIL(sessionId));
  },

  /**
   * Create new exam import session
   * @returns {Promise}
   */
  create() {
    return axiosClient.post(API_ENDPOINTS.EXAM_IMPORT_SESSION.CREATE);
  },

  /**
   * Get raw content with presigned URLs for session
   * @param {string} sessionId - Session ID
   * @param {number} expiry - URL expiry time in seconds (default: 3600)
   * @returns {Promise}
   */
  getMyRawContent(sessionId, expiry = 3600) {
    return axiosClient.get(API_ENDPOINTS.EXAM_IMPORT_SESSION.MY_RAW_CONTENT(sessionId), {
      params: { expiry },
    });
  },

  /**
   * Update raw content for session
   * @param {string} sessionId - Session ID
   * @param {string} rawContent - New raw content
   * @returns {Promise}
   */
  updateMyRawContent(sessionId, rawContent) {
    return axiosClient.put(API_ENDPOINTS.EXAM_IMPORT_SESSION.UPDATE_MY_RAW_CONTENT(sessionId), {
      rawContent,
    });
  },

  /**
   * Split questions from session's raw content
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  splitFromSession(sessionId) {
    return axiosClient.post(API_ENDPOINTS.EXAM_IMPORT_SESSION.SPLIT_FROM_SESSION(sessionId));
  },

  /**
   * Split questions from provided raw content for a specific session
   * @param {number} sessionId - Session ID
   * @param {string} rawContent - Raw content to split
   * @returns {Promise}
   */
  splitFromRawContent(sessionId, rawContent) {
    return axiosClient.post(API_ENDPOINTS.EXAM_IMPORT_SESSION.SPLIT_FROM_RAW_CONTENT(sessionId), {
      rawContent,
    });
  },

  /**
   * Classify chapters for questions in a session using AI
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  classifyChapters(sessionId) {
    return axiosClient.post(API_ENDPOINTS.EXAM_IMPORT_SESSION.CLASSIFY_CHAPTERS(sessionId));
  },

  /**
   * Migrate temp exam data to final exam tables
   * Creates Exam, Sections, Questions, Statements from temp tables
   * @param {string|number} sessionId - Session ID
   * @returns {Promise<{examId: number, totalSections: number, totalQuestions: number, totalStatements: number, totalChapters: number}>}
   */
  migrate(sessionId) {
    return axiosClient.post(API_ENDPOINTS.EXAM_IMPORT_SESSION.MIGRATE(sessionId));
  },

  /**
   * Tách câu hỏi thủ công từ nội dung thô theo loại câu hỏi chỉ định.
   * Chỉ người tạo session mới được sử dụng.
   * Nếu có lỗi parse, trả về success: false nhưng vẫn kèm data (parseErrors[]) để người dùng sửa.
   * Khi có lỗi parse sẽ KHÔNG lưu DB.
   *
   * @param {string|number} sessionId  - ID của ExamImportSession
   * @param {string} rawContent        - Văn bản thô chứa danh sách câu hỏi
   * @param {string} questionType      - SINGLE_CHOICE | TRUE_FALSE | SHORT_ANSWER
   * @param {string} [answers]         - Chuỗi đáp án cách nhau bởi dấu cách (tuỳ chọn)
   * @returns {Promise<ManualSplitQuestionsResponseDto>}
   */
  manualSplit(sessionId, { rawContent, questionType, answers }) {
    return axiosClient.post(API_ENDPOINTS.EXAM_IMPORT_SESSION.MANUAL_SPLIT(sessionId), {
      rawContent,
      questionType,
      ...(answers !== undefined && answers !== '' ? { answers } : {}),
    });
  },
};
