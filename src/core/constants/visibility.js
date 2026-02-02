export const VISIBILITY = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    PRIVATE: 'PRIVATE',
};

export const VISIBILITY_OPTIONS = [
    { label: 'Bản nháp', value: VISIBILITY.DRAFT },
    { label: 'Đã xuất bản', value: VISIBILITY.PUBLISHED },
    { label: 'Riêng tư', value: VISIBILITY.PRIVATE },
];

export const VISIBILITY_LABELS = {
    [VISIBILITY.DRAFT]: 'Bản nháp',
    [VISIBILITY.PUBLISHED]: 'Đã xuất bản',
    [VISIBILITY.PRIVATE]: 'Riêng tư',
};