import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const superAdminApi = {
    /**
     * Reset password for students created within a date range.
     * New password equals the student's phone number.
     * POST /super-admin/reset-password-by-date-range
     */
    resetPasswordByDateRange: (data) => {
        return axiosClient.post(API_ENDPOINTS.SUPER_ADMIN.RESET_PASSWORD_BY_DATE_RANGE, data);
    },

    /**
     * Update Admin and its User data directly.
     * POST /super-admin/update-admin-direct
     */
    updateAdminDirect: (data) => {
        return axiosClient.post(API_ENDPOINTS.SUPER_ADMIN.UPDATE_ADMIN_DIRECT, data);
    },

    /**
     * Find and delete all media that has no usage and was created more than 30 days ago.
     * POST /super-admin/cleanup-unused-media-older-than-30-days
     */
    cleanupUnusedMediaOlderThan30Days: (data = {}) => {
        return axiosClient.post(
            API_ENDPOINTS.SUPER_ADMIN.CLEANUP_UNUSED_MEDIA_OLDER_THAN_30_DAYS,
            data
        );
    },

    /**
     * Generate slug for all exams that are missing slug.
     * POST /super-admin/exams/generate-missing-slugs
     */
    generateMissingExamSlugs: (data = {}) => {
        return axiosClient.post(API_ENDPOINTS.SUPER_ADMIN.GENERATE_MISSING_EXAM_SLUGS, data);
    },

    /**
     * Regenerate slug for questions whose slug matches question-123.
     * POST /super-admin/questions/regenerate-slugs
     */
    regenerateQuestionSlugs: (data = {}) => {
        return axiosClient.post(API_ENDPOINTS.SUPER_ADMIN.REGENERATE_QUESTION_SLUGS, data);
    },

    /**
     * Seed default tags by upsert.
     * POST /super-admin/tags/seed-defaults
     */
    seedDefaultTags: (data = {}) => {
        return axiosClient.post(API_ENDPOINTS.SUPER_ADMIN.SEED_DEFAULT_TAGS, data);
    },

    /**
     * Promote student grade by high school graduation year.
     * POST /super-admin/students/promote-grade/by-graduation-year
     */
    promoteStudentGradeByGraduationYear: (data) => {
        return axiosClient.post(
            API_ENDPOINTS.SUPER_ADMIN.PROMOTE_STUDENT_GRADE_BY_GRADUATION_YEAR,
            data
        );
    },

    /**
     * Update high school graduation year for students by grade.
     * POST /super-admin/students/graduation-year/by-grade
     */
    updateStudentGraduationYearByGrade: (data) => {
        return axiosClient.post(
            API_ENDPOINTS.SUPER_ADMIN.UPDATE_STUDENT_GRADUATION_YEAR_BY_GRADE,
            data
        );
    },

    /**
     * Xóa cứng học sinh theo năm tốt nghiệp cấp 3 và khối, trừ học sinh được
     * bảo vệ bởi danh sách khóa học truyền vào.
     *
     * POST /super-admin/students/hard-delete-by-graduation-year-grade-excluded-courses
     *
     * Rule quan trọng:
     * - Đây là thao tác xóa cứng, không thể khôi phục bằng soft delete.
     * - courseIds bắt buộc là mảng không rỗng và mọi ID phải tồn tại.
     * - Chỉ học sinh khớp cả highSchoolGraduationYear và grade mới là ứng viên xóa.
     * - Học sinh đang đăng ký khóa học hoặc nằm trong lớp thuộc courseIds sẽ được giữ lại.
     * - Dữ liệu liên quan được xóa trong transaction; lỗi xóa file avatar sau DB commit
     *   sẽ được trả trong avatarFileResults.
     */
    hardDeleteStudentsByGraduationYearGradeExcludedCourses: (data) => {
        return axiosClient.post(
            API_ENDPOINTS.SUPER_ADMIN
                .HARD_DELETE_STUDENTS_BY_GRADUATION_YEAR_GRADE_EXCLUDED_COURSES,
            data
        );
    },
};
