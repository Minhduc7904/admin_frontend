/**
 * Question Type Constants
 * Đồng bộ với backend QuestionType enum
 */
export const QUESTION_TYPES = {
    SINGLE_CHOICE: 'SINGLE_CHOICE',
    MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
    SHORT_ANSWER: 'SHORT_ANSWER',
    ESSAY: 'ESSAY',
    TRUE_FALSE: 'TRUE_FALSE',
};

export const QUESTION_TYPE_OPTIONS = [
    { value: QUESTION_TYPES.SINGLE_CHOICE, label: 'Trắc nghiệm' },
    { value: QUESTION_TYPES.MULTIPLE_CHOICE, label: 'Trắc nghiệm nhiều đáp án' },
    { value: QUESTION_TYPES.SHORT_ANSWER, label: 'Tự luận ngắn' },
    { value: QUESTION_TYPES.ESSAY, label: 'Tự luận' },
    { value: QUESTION_TYPES.TRUE_FALSE, label: 'Đúng/Sai' },
];

// Export as QuestionType for convenience
export const QuestionType = QUESTION_TYPES;

/**
 * Question Type Labels
 */
export const QUESTION_TYPE_LABELS = {
    [QUESTION_TYPES.SINGLE_CHOICE]: 'Trắc nghiệm',
    [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Đa lựa chọn',
    [QUESTION_TYPES.SHORT_ANSWER]: 'Tự luận ngắn',
    [QUESTION_TYPES.ESSAY]: 'Tự luận',
    [QUESTION_TYPES.TRUE_FALSE]: 'Đúng/Sai',
};

/**
 * Question Type Colors (Tailwind CSS classes)
 */
export const QUESTION_TYPE_COLORS = {
    [QUESTION_TYPES.SINGLE_CHOICE]: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
    },
    [QUESTION_TYPES.MULTIPLE_CHOICE]: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
    },
    [QUESTION_TYPES.SHORT_ANSWER]: {
        bg: 'bg-green-100',
        text: 'text-green-600',
    },
    [QUESTION_TYPES.ESSAY]: {
        bg: 'bg-green-100',
        text: 'text-green-600',
    },
    [QUESTION_TYPES.TRUE_FALSE]: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
    },
};

/**
 * Difficulty Constants
 * Đồng bộ với backend Difficulty enum
 */
export const DIFFICULTY = {
    NB: 'NB',  // Nhận biết
    TH: 'TH',  // Thông hiểu
    VD: 'VD',  // Vận dụng
    VDC: 'VDC', // Vận dụng cao
};

export const DIFFICULTY_OPTIONS = [
    { value: DIFFICULTY.NB, label: 'Nhận biết' },
    { value: DIFFICULTY.TH, label: 'Thông hiểu' },
    { value: DIFFICULTY.VD, label: 'Vận dụng' },
    { value: DIFFICULTY.VDC, label: 'Vận dụng cao' },
];

// Export as Difficulty for convenience
export const Difficulty = DIFFICULTY;

/**
 * Difficulty Labels
 */
export const DIFFICULTY_LABELS = {
    [DIFFICULTY.NB]: 'Nhận biết',
    [DIFFICULTY.TH]: 'Thông hiểu',
    [DIFFICULTY.VD]: 'Vận dụng',
    [DIFFICULTY.VDC]: 'Vận dụng cao',
};

/**
 * Difficulty Levels (từ dễ đến khó)
 */
export const DIFFICULTY_LEVELS = {
    [DIFFICULTY.NB]: 1,
    [DIFFICULTY.TH]: 2,
    [DIFFICULTY.VD]: 3,
    [DIFFICULTY.VDC]: 4,
};

/**
 * Difficulty Colors (Tailwind CSS classes)
 */
export const DIFFICULTY_COLORS = {
    [DIFFICULTY.NB]: {
        bg: 'bg-green-100',
        text: 'text-green-600',
    },
    [DIFFICULTY.TH]: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
    },
    [DIFFICULTY.VD]: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
    },
    [DIFFICULTY.VDC]: {
        bg: 'bg-red-100',
        text: 'text-red-600',
    },
};

/**
 * Helper function to get question type label
 */
export const getQuestionTypeLabel = (type) => {
    return QUESTION_TYPE_LABELS[type] || type;
};

/**
 * Helper function to get question type color classes
 */
export const getQuestionTypeColor = (type) => {
    return QUESTION_TYPE_COLORS[type] || { bg: 'bg-gray-100', text: 'text-gray-600' };
};

/**
 * Helper function to get difficulty label
 */
export const getDifficultyLabel = (difficulty) => {
    return DIFFICULTY_LABELS[difficulty] || difficulty;
};

/**
 * Helper function to get difficulty color classes
 */
export const getDifficultyColor = (difficulty) => {
    return DIFFICULTY_COLORS[difficulty] || { bg: 'bg-gray-100', text: 'text-gray-600' };
};
