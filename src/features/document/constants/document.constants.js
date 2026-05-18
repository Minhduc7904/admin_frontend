export const DOCUMENT_VISIBILITY_OPTIONS = [
    { value: 'DRAFT', label: 'Bản nháp' },
    { value: 'PRIVATE', label: 'Riêng tư' },
    { value: 'PUBLISHED', label: 'Đã xuất bản' },
];

export const DOCUMENT_VISIBILITY_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    ...DOCUMENT_VISIBILITY_OPTIONS,
];

export const DOCUMENT_VISIBILITY_LABELS = DOCUMENT_VISIBILITY_OPTIONS.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
}, {});

export const DOCUMENT_FEATURED_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả' },
    { value: 'true', label: 'Nổi bật' },
    { value: 'false', label: 'Không nổi bật' },
];
