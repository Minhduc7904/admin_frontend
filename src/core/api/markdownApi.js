import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const markdownApi = {
    /**
     * Sửa chính tả và ngữ pháp đoạn Markdown.
     *
     * ─── ĐẦU VÀO ────────────────────────────────────────────────────────────────
     * @param {string} content  Đoạn văn bản Markdown cần sửa chính tả.
     *                          Có thể chứa:
     *                          - Ký hiệu toán học ($...$, $$...$$) – sẽ được bảo toàn
     *                          - Media placeholder (![media:ID]) – sẽ được bảo toàn
     *                          - Bảng Markdown, danh sách, tiêu đề – sẽ được bảo toàn
     *                          Tối đa 50.000 ký tự.
     *
     * ─── ĐẦU RA ─────────────────────────────────────────────────────────────────
     * @returns {Promise<FixMarkdownResponseDto>}
     *   - fixedContent      : Nội dung Markdown đã được sửa chính tả
     *   - processingTimeMs  : Thời gian xử lý (ms)
     *   - usage             : Thông tin token sử dụng (promptTokens, completionTokens, totalTokens)
     */
    fixSpelling: (content) => {
        return axiosClient.post(API_ENDPOINTS.MARKDOWN.FIX_SPELLING, { content });
    },
};
