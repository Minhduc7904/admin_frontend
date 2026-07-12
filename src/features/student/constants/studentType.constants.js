export const STUDENT_TYPE_OPTIONS = [
    { value: 'OFFLINE', label: 'Học trực tiếp' },
    { value: 'ONLINE', label: 'Học trực tuyến' },
];

export const STUDENT_TYPE_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả loại học sinh' },
    ...STUDENT_TYPE_OPTIONS,
];

export const STUDENT_TYPE_LABELS = STUDENT_TYPE_OPTIONS.reduce((labels, option) => {
    labels[option.value] = option.label;
    return labels;
}, {});
