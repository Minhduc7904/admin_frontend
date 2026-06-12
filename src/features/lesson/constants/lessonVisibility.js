export const LESSON_VISIBILITY = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    DRAFT: 'DRAFT',
};

export const LESSON_VISIBILITY_OPTIONS = [
    { value: LESSON_VISIBILITY.PUBLIC, label: 'Công khai' },
    { value: LESSON_VISIBILITY.PRIVATE, label: 'Riêng tư' },
    { value: LESSON_VISIBILITY.DRAFT, label: 'Bản nháp' },
];

export const LESSON_VISIBILITY_META = {
    [LESSON_VISIBILITY.PUBLIC]: {
        label: 'Công khai',
        shortLabel: 'Public',
        className: 'bg-emerald-50 text-emerald-700',
        statClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        dotClassName: 'bg-emerald-500',
    },
    [LESSON_VISIBILITY.PRIVATE]: {
        label: 'Riêng tư',
        shortLabel: 'Private',
        className: 'bg-amber-50 text-amber-700',
        statClassName: 'border-amber-200 bg-amber-50 text-amber-700',
        dotClassName: 'bg-amber-500',
    },
    [LESSON_VISIBILITY.DRAFT]: {
        label: 'Bản nháp',
        shortLabel: 'Draft',
        className: 'bg-gray-100 text-gray-600',
        statClassName: 'border-gray-200 bg-gray-50 text-gray-700',
        dotClassName: 'bg-gray-400',
    },
};

export const normalizeLessonVisibility = (visibility) => {
    if (visibility === 'PUBLISHED') return LESSON_VISIBILITY.PUBLIC;
    return visibility || LESSON_VISIBILITY.DRAFT;
};
