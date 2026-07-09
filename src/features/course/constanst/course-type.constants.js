export const COURSE_TYPES = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    ALL: 'ALL',
};

export const COURSE_TYPE_OPTIONS = [
    { value: COURSE_TYPES.OFFLINE, label: 'Offline' },
    { value: COURSE_TYPES.ONLINE, label: 'Online' },
    { value: COURSE_TYPES.ALL, label: 'Online + Offline' },
];

export const COURSE_TYPE_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả loại khóa' },
    ...COURSE_TYPE_OPTIONS,
];

export const COURSE_TYPE_LABELS = {
    [COURSE_TYPES.ONLINE]: 'Online',
    [COURSE_TYPES.OFFLINE]: 'Offline',
    [COURSE_TYPES.ALL]: 'Online + Offline',
};

export const getCourseTypeLabel = (courseType) => COURSE_TYPE_LABELS[courseType] || COURSE_TYPE_LABELS[COURSE_TYPES.OFFLINE];
