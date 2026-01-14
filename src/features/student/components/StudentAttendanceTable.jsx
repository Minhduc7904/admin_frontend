import { Eye, Edit2, Trash2, Calendar } from 'lucide-react';
import { Table } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils';

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

export const StudentAttendanceTable = ({
    attendances,
    loading,
    onView,
    onEdit,
    onDelete,
}) => {
    const columns = [
        {
            key: 'attendanceId',
            label: 'ID',
            render: (attendance) => (
                <span className="text-sm text-foreground-light">
                    #{attendance.attendanceId}
                </span>
            ),
        },

        {
            key: 'session',
            label: 'Buổi học',
            render: (attendance) => {
                const session = attendance.classSession;
                if (!session) {
                    return <span className="text-sm text-foreground-light">-</span>;
                }

                return (
                    <div className="flex items-start gap-2">
                        <Calendar size={14} className="text-foreground-light mt-0.5" />
                        <div>
                            <span className="text-sm font-medium text-foreground">
                                {session.name}
                            </span>
                            <p className="text-xs text-foreground-light">
                                {formatDateTime(session.sessionDate)} •{' '}
                                {new Date(session.startTime).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}{' '}
                                -{' '}
                                {new Date(session.endTime).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                );
            },
        },

        {
            key: 'class',
            label: 'Lớp học',
            render: (attendance) => {
                const courseClass = attendance.classSession?.courseClass;
                if (!courseClass) {
                    return <span className="text-sm text-foreground-light">-</span>;
                }

                return (
                    <div>
                        <span className="text-sm font-medium text-foreground">
                            {courseClass.className}
                        </span>
                        {courseClass.course && (
                            <p className="text-xs text-foreground-light">
                                {courseClass.course.title}
                            </p>
                        )}
                    </div>
                );
            },
        },

        {
            key: 'status',
            label: 'Trạng thái',
            render: (attendance) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[attendance.status]
                        }`}
                >
                    {STATUS_LABEL[attendance.status] || '-'}
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
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            render: (attendance) => (
                <div className="flex items-center justify-end gap-2">
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

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(attendance);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Cập nhật"
                    >
                        <Edit2 size={16} className="text-warning" />
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(attendance);
                        }}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={16} className="text-red-600" />
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
