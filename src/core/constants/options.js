export const ATTENDANCE_STATUS_OPTIONS = [
    { value: 'PRESENT', label: 'Có mặt' },
    { value: 'ABSENT', label: 'Vắng' },
    { value: 'LATE', label: 'Muộn' },
    { value: 'MAKEUP', label: 'Học bù' },
];

export const SESSION_STATUS_OPTIONS = [
    { value: 'past', label: 'Đã qua' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'upcoming', label: 'Sắp tới' },
];
export const MEDIA_TYPE_OPTIONS = [
    { value: 'IMAGE', label: 'Hình ảnh' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'AUDIO', label: 'Âm thanh' },
    { value: 'DOCUMENT', label: 'Tài liệu' },
    { value: 'OTHER', label: 'Khác' },
];

export const MEDIA_STATUS_OPTIONS = [
    { value: 'READY', label: 'Sẵn sàng' },
    { value: 'UPLOADING', label: 'Đang tải' },
    { value: 'FAILED', label: 'Thất bại' },
    { value: 'DELETED', label: 'Đã xóa' },
];

export const MEDIA_SORT_OPTIONS = [
    { value: 'createdAt', label: 'Ngày tải lên' },
    { value: 'fileSize', label: 'Kích thước' },
    { value: 'filename', label: 'Tên file' },
];

export const SORT_ORDER_OPTIONS = [
    { value: 'desc', label: 'Giảm dần' },
    { value: 'asc', label: 'Tăng dần' },
];

export const TIME_RANGE_OPTIONS = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'yesterday', label: 'Hôm qua' },
    { value: 'dayBeforeYesterday', label: 'Hôm kia' },

    { value: 'thisWeek', label: 'Tuần này' },
    { value: 'lastWeek', label: 'Tuần trước' },

    { value: 'thisMonth', label: 'Tháng này' },
    { value: 'lastMonth', label: 'Tháng trước' },
];

