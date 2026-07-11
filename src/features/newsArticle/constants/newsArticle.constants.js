export const NEWS_ARTICLE_TYPE_OPTIONS = [
    { value: 'NEWS', label: 'Tin tức' },
    { value: 'ANNOUNCEMENT', label: 'Thông báo' },
    { value: 'GUIDE', label: 'Hướng dẫn' },
    { value: 'EVENT', label: 'Sự kiện' },
    { value: 'LEARNING', label: 'Bài viết học tập' },
    { value: 'COURSE_MEMORY', label: 'Kỷ niệm khóa học' },
];

export const NEWS_ARTICLE_TYPE_LABELS = NEWS_ARTICLE_TYPE_OPTIONS.reduce((labels, option) => {
    labels[option.value] = option.label;
    return labels;
}, {});

export const NEWS_ARTICLE_VISIBILITY_OPTIONS = [
    { value: 'DRAFT', label: 'Bản nháp' },
    { value: 'PRIVATE', label: 'Riêng tư' },
    { value: 'PUBLISHED', label: 'Đã xuất bản' },
];

export const NEWS_ARTICLE_VISIBILITY_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    ...NEWS_ARTICLE_VISIBILITY_OPTIONS,
];

export const NEWS_ARTICLE_VISIBILITY_LABELS = NEWS_ARTICLE_VISIBILITY_OPTIONS.reduce((labels, option) => {
    labels[option.value] = option.label;
    return labels;
}, {});

export const NEWS_ARTICLE_FEATURED_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả bài viết' },
    { value: 'true', label: 'Bài viết nổi bật' },
    { value: 'false', label: 'Bài viết thường' },
];

export const EMPTY_NEWS_CONTENT = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
};
