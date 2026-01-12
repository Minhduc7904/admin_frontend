import { Edit2, Trash2, User, Calendar, Eye } from 'lucide-react';
import { Table } from '../../../shared/components/ui';

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

export const AttendanceTable = ({
    attendances,
    onEdit,
    onDelete,
    onView,
    loading,
}) => {
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
                        <span className="text-sm font-medium text-foreground">
                            {attendance.student.fullName || 'N/A'}
                        </span>
                        {attendance.student.studentId && (
                            <>
                                <p className="text-xs text-foreground-light">
                                    #{attendance.student.studentId} / {attendance.student.school || ''}
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
            render: (attendance) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[attendance.status]}`}
                >
                    {attendance.statusLabel || STATUS_LABEL[attendance.status]}
                </span>
            ),
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
        />
    );
};
