import {
    CheckCircle,
    Clock,
    Ban,
    Lock,
    FlaskConical,
} from 'lucide-react';

export const COURSE_ENROLLMENT_STATUS = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    BLOCKED_UNPAID: 'BLOCKED_UNPAID',
    TRIAL: 'TRIAL',
};

export const COURSE_ENROLLMENT_STATUS_OPTIONS = [
    { value: COURSE_ENROLLMENT_STATUS.ACTIVE, label: 'Đang học' },
    { value: COURSE_ENROLLMENT_STATUS.COMPLETED, label: 'Hoàn thành' },
    { value: COURSE_ENROLLMENT_STATUS.CANCELLED, label: 'Hủy' },
    { value: COURSE_ENROLLMENT_STATUS.BLOCKED_UNPAID, label: 'Khóa do chưa thanh toán' },
    { value: COURSE_ENROLLMENT_STATUS.TRIAL, label: 'Học thử' },
];

export const COURSE_ENROLLMENT_STATUS_CONFIG = {
    ACTIVE: {
        label: 'Đang học',
        icon: CheckCircle,
        className: 'text-green-600 bg-green-50',
    },
    COMPLETED: {
        label: 'Hoàn thành',
        icon: CheckCircle,
        className: 'text-blue-600 bg-blue-50',
    },
    CANCELLED: {
        label: 'Đã hủy',
        icon: Ban,
        className: 'text-gray-600 bg-gray-100',
    },
    BLOCKED_UNPAID: {
        label: 'Chưa thanh toán',
        icon: Lock,
        className: 'text-red-600 bg-red-50',
    },
    TRIAL: {
        label: 'Học thử',
        icon: FlaskConical,
        className: 'text-yellow-700 bg-yellow-50',
    },
};
