import {
    Bell,
    BookOpen,
    GraduationCap,
    CalendarCheck,
    MessageCircle,
    Info,
    CheckCircle,
    AlertTriangle,
    XCircle,
} from 'lucide-react'

/* ===================== TYPE UI ===================== */
/**
 * Icon đại diện cho NGỮ CẢNH thông báo
 */
export const NOTIFICATION_TYPE_UI = {
    SYSTEM: {
        icon: Bell,
        label: 'Hệ thống',
    },
    COURSE: {
        icon: BookOpen,
        label: 'Khóa học',
    },
    LESSON: {
        icon: GraduationCap,
        label: 'Bài học',
    },
    ATTENDANCE: {
        icon: CalendarCheck,
        label: 'Điểm danh',
    },
    MESSAGE: {
        icon: MessageCircle,
        label: 'Tin nhắn',
    },
    OTHER: {
        icon: Bell,
        label: 'Khác',
    },
}

/* ===================== LEVEL UI ===================== */
/**
 * Màu sắc + icon phụ theo MỨC ĐỘ
 */
export const NOTIFICATION_LEVEL_UI = {
    INFO: {
        color: 'border-blue-500 text-blue-600',
        icon: Info,
    },
    SUCCESS: {
        color: 'border-green-500 text-green-600',
        icon: CheckCircle,
    },
    WARNING: {
        color: 'border-yellow-500 text-yellow-600',
        icon: AlertTriangle,
    },
    ERROR: {
        color: 'border-red-500 text-red-600',
        icon: XCircle,
    },
    DEFAULT: {
        color: 'border-gray-400 text-gray-500',
        icon: Bell,
    },
}
