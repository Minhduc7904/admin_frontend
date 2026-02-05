/**
 * Media Usage Constants
 * Entity types and field names for media attachments
 */

// Entity Types
export const ENTITY_TYPES = {
    USER: 'USER',
    STUDENT: 'STUDENT',
    COURSE: 'COURSE',
    LESSON: 'LESSON',
    EXAM: 'EXAM',
    EXAM_IMPORT_SESSION: 'EXAM_IMPORT_SESSION',
    TEMP_EXAM: 'TEMP_EXAM',
    TEMP_SECTION: 'TEMP_SECTION',
    TEMP_QUESTION: 'TEMP_QUESTION',
    CHAPTER: 'CHAPTER',
};

// Field Names for ExamImportSession
export const EXAM_IMPORT_SESSION_FIELDS = {
    UPLOAD_PDF: 'EXAM_IMPORT_SESSION_PDF',
};

// Field Names for TempExam
export const TEMP_EXAM_FIELDS = {
    EXAM_FILE: 'TEMP_EXAM_FILE',
    SOLUTION_FILE: 'TEMP_SOLUTION_FILE',
    EXAM_IMAGE: 'TEMP_EXAM_IMAGE',
    SOLUTION_VIDEO: 'TEMP_SOLUTION_VIDEO',
};

// Field Names for Exam
export const EXAM_FIELDS = {
    EXAM_FILE: 'EXAM_FILE',
    SOLUTION_FILE: 'EXAM_SOLUTION_FILE',
    EXAM_IMAGE: 'EXAM_IMAGE',
    SOLUTION_VIDEO: 'EXAM_SOLUTION_VIDEO',
};

// Field Names for User
export const USER_FIELDS = {
    AVATAR: 'USER_AVATAR',
    COVER: 'USER_COVER',
};

// Field Names for Course
export const COURSE_FIELDS = {
    THUMBNAIL: 'COURSE_THUMBNAIL',
    BANNER: 'COURSE_BANNER',
};

// Field Names for Lesson
export const LESSON_FIELDS = {
    THUMBNAIL: 'LESSON_THUMBNAIL',
    VIDEO: 'LESSON_VIDEO',
    DOCUMENT: 'LESSON_DOCUMENT',
};
