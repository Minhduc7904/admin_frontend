export const TAG_TYPES = [
    { value: 'LEVEL', label: 'Cấp học' },
    { value: 'GRADE', label: 'Khối lớp' },
    { value: 'CHAPTER', label: 'Chương' },
    { value: 'DOCUMENT_TYPE', label: 'Loại tài liệu' },
    { value: 'SUBJECT', label: 'Môn học' },
    { value: 'TOPIC', label: 'Chủ đề' },
    { value: 'KEYWORD', label: 'Từ khóa' },
    { value: 'OTHER', label: 'Khác' },
];

export const TAG_TYPE_LABELS = TAG_TYPES.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
}, {});

export const TAG_STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'true', label: 'Đang hoạt động' },
    { value: 'false', label: 'Tạm ẩn' },
];

export const TAG_TYPE_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả loại tag' },
    ...TAG_TYPES,
];
