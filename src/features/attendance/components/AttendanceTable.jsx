import { Edit2, Trash2, User, Calendar, Eye, FileImage, BellRing } from 'lucide-react';
import { Table } from '../../../shared/components/ui';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { AttendanceStatusDropdown } from './AttendanceStatusDropdown';
/* ===================== STATUS BADGE MAP ===================== */
const STATUS_BADGE = {
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT: 'bg-red-100 text-red-700',
    LATE: 'bg-yellow-100 text-yellow-700',
    MAKEUP: 'bg-blue-100 text-blue-700',
};

const STATUS_LABEL = {
    PRESENT: 'Có mặt',
    ABSENT: 'Vắng',
    LATE: 'Muộn',
    MAKEUP: 'Học bù',
};

/* ===================== TUITION STATUS BADGE ===================== */
const TUITION_BADGE = {
    PAID: 'bg-green-100 text-green-700',
    UNPAID: 'bg-red-100 text-red-700',
};
const TUITION_LABEL = {
    PAID: 'Đã đóng',
    UNPAID: 'Chưa đóng',
};

/* ===================== HOMEWORK SUBMIT STATUS ===================== */
const HOMEWORK_BADGE = {
    submitted: 'bg-green-100 text-green-700',
    notAssigned: 'bg-gray-100 text-gray-600',
    notSubmitted: 'bg-red-100 text-red-700',
};

export const AttendanceTable = ({
    attendances,
    onEdit,
    onDelete,
    onView,
    onExport,
    onToggleParentNotified,
    onStatusChange,
    loading,
    tuitionMonth,
    tuitionYear,
    showHomework = false,
    homeworkTitle,
    statusLoading = false,
    statusUpdatingAttendanceId = null,
}) => {
    const showTuitionCol = !!tuitionMonth && !!tuitionYear;
    const showHomeworkCol = showHomework;
    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (attendance) => (
                <span className="text-sm text-foreground-light">
                    #{attendance.attendanceId}
                </span>
            ),
        },
        {
            key: 'student',
            label: 'Học sinh',
            render: (attendance) => (
                <div className="flex items-center gap-2">
                    <User size={14} className="text-foreground-light" />
                    <div>
                        <Link to={ROUTES.STUDENT_DETAIL(attendance.studentId)} className="hover:underline cursor-pointer">
                            <span className="text-sm font-medium text-foreground">
                                {attendance.student.fullName || 'N/A'}
                            </span>
                        </Link>
                        {attendance.student.studentId && (
                            <>
                                <p className="text-xs text-foreground-light">
                                    #{attendance.student.studentId} / {attendance.student.school || ''} / Lớp {attendance.student.grade || ''}
                                </p>
                                <p className="text-xs text-foreground-light">
                                    {attendance.student.studentPhone} / {attendance.student.parentPhone || ''}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'session',
            label: 'Buổi học',
            render: (attendance) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-foreground-light" />
                    <span className="text-sm text-foreground">
                        {attendance.classSession.name || `Buổi #${attendance.sessionId}`}
                    </span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (attendance) => {
                const isStatusUpdating =
                    statusLoading && statusUpdatingAttendanceId === attendance.attendanceId;

                return (
                    <div className="w-32">
                    <AttendanceStatusDropdown
                        value={attendance.status}
                        disabled={isStatusUpdating}
                        loading={isStatusUpdating}
                        onChange={(newStatus) => {
                            if (onStatusChange) {
                                onStatusChange(attendance, newStatus);
                            }
                        }}
                    />
                </div>
                );
            },
        },
        {
            key: 'markedAt',
            label: 'Thời gian điểm danh',
            render: (attendance) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {formatDateTime(attendance.markedAt)}
                </span>
            ),
        },
        {
            key: 'notes',
            label: 'Ghi chú',
            render: (attendance) => (
                <span
                    className="text-sm text-foreground-light max-w-[200px] truncate block"
                    title={attendance.notes}
                >
                    {attendance.notes || '-'}
                </span>
            ),
        },
        {
            key: 'parentNotified',
            label: (
                <span className="flex items-center justify-center w-full">
                    <BellRing size={13} />
                </span>
            ),
            align: 'center',
            render: (attendance) => (
                <div className="flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={!!attendance.parentNotified}
                        onChange={() => { }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleParentNotified && onToggleParentNotified(attendance);
                        }}
                        className="w-4 h-4 accent-green-600 cursor-pointer"
                        title={attendance.parentNotified ? 'Đã gửi phiếu cho phụ huynh' : 'Chưa gửi phiếu cho phụ huynh'}
                    />
                </div>
            ),
        },
        {
            key: 'makeupNote',
            label: 'Ghi chú học bù',
            render: (attendance) => (
                <span
                    className="text-sm text-foreground-light max-w-[200px] truncate block"
                    title={attendance.classSession.makeupNote}
                >
                    {attendance.classSession.makeupNote || '-'}
                </span>
            ),
        },
        ...(showHomeworkCol
            ? [
                {
                    key: 'homework',
                    label: homeworkTitle ? `BT: ${homeworkTitle}` : 'Bài tập về nhà',
                    render: (attendance) => {
                        const homeworkId = attendance.classSession?.homeworkId;
                        const hs = attendance.homeworkSubmit;

                        if (!homeworkId) {
                            return (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${HOMEWORK_BADGE.notAssigned}`}>
                                    Không giao bài
                                </span>
                            );
                        }

                        if (!hs) {
                            return (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${HOMEWORK_BADGE.notSubmitted}`}>
                                    Chưa nộp
                                </span>
                            );
                        }
                        return (
                            <div className="flex flex-col gap-0.5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${HOMEWORK_BADGE.submitted}`}>
                                    Đã nộp
                                </span>
                                {hs.points != null && (
                                    <span className="text-xs text-foreground-light">
                                        {hs.points} điểm
                                    </span>
                                )}
                            </div>
                        );
                    },
                },
            ]
            : []),
        ...(showTuitionCol
            ? [
                {
                    key: 'tuition',
                    label: `Học phí T${tuitionMonth}/${tuitionYear}`,
                    render: (attendance) => {
                        const tp = attendance.tuitionPayment;
                        if (!tp) {
                            return (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                    Không có học phí T{tuitionMonth}/{tuitionYear}
                                </span>
                            );
                        }
                        return (
                            <div className="flex flex-col gap-0.5">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TUITION_BADGE[tp.status] ?? 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {tp.statusLabel ?? tp.status}
                                </span>
                            </div>
                        );
                    },
                },
            ]
            : []),
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            render: (attendance) => (
                <div className="flex items-center justify-end gap-2">
                    {/* View */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(attendance);
                        }}
                        className="p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} className="text-blue-600" />
                    </button>
                    {/* Export */}
                    {onExport && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onExport(attendance);
                            }}
                            className="p-1 rounded hover:bg-purple-100 transition-colors"
                            title="Xuất phiếu"
                        >
                            <FileImage size={16} className="text-purple-600" />
                        </button>
                    )}
                    {/* Edit */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(attendance);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Cập nhật điểm danh"
                    >
                        <Edit2 size={16} className="text-warning" />
                    </button>
                    {/* Delete */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(attendance);
                        }}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                        title="Xóa điểm danh"
                    >
                        <Trash2
                            size={16}
                            className="text-red-600"
                        />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={attendances}
            loading={loading}
            emptyMessage="Chưa có điểm danh nào"
            onRowClick={onView}
        />
    );
};
