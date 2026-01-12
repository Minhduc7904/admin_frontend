import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Table, Badge } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils';

const ATTENDANCE_STATUS = {
    PRESENT: { label: 'Có mặt', variant: 'success' },
    ABSENT: { label: 'Vắng', variant: 'danger' },
    LATE: { label: 'Muộn', variant: 'warning' },
    MAKEUP: { label: 'Học bù', variant: 'info' },
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
                <span className="font-mono text-sm">
                    #{attendance.attendanceId}
                </span>
            ),
        },
        {
            key: 'session',
            label: 'Buổi học',
            render: (attendance) => {
                const session = attendance.classSession;
                if (!session) return <span className="text-foreground-light">-</span>;
                
                return (
                    <div>
                        <div className="font-medium">{session.name}</div>
                        <div className="text-sm text-foreground-light">
                            {formatDateTime(session.sessionDate)} • {' '}
                            {new Date(session.startTime).toLocaleTimeString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })} - {' '}
                            {new Date(session.endTime).toLocaleTimeString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
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
                if (!courseClass) return <span className="text-foreground-light">-</span>;
                
                return (
                    <div>
                        <div className="font-medium">{courseClass.className}</div>
                        {courseClass.course && (
                            <div className="text-sm text-foreground-light">
                                {courseClass.course.title}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (attendance) => {
                const status = ATTENDANCE_STATUS[attendance.status];
                return status ? (
                    <Badge variant={status.variant}>{status.label}</Badge>
                ) : (
                    <span className="text-foreground-light">-</span>
                );
            },
        },
        {
            key: 'markedAt',
            label: 'Thời gian điểm danh',
            render: (attendance) => (
                <span className="text-sm">
                    {formatDateTime(attendance.markedAt)}
                </span>
            ),
        },
        {
            key: 'notes',
            label: 'Ghi chú',
            render: (attendance) => (
                <span className="text-sm text-foreground-light">
                    {attendance.notes || '-'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: '',
            render: (attendance) => (
                <div className="flex items-center gap-2 justify-end">
                    <button
                        onClick={() => onView(attendance)}
                        className="p-2 hover:bg-background-light rounded-sm transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} className="text-foreground-light" />
                    </button>
                    <button
                        onClick={() => onEdit(attendance)}
                        className="p-2 hover:bg-blue-50 rounded-sm transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button
                        onClick={() => onDelete(attendance)}
                        className="p-2 hover:bg-red-50 rounded-sm transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={16} className="text-red-600" />
                    </button>
                </div>
            ),
        },
    ];

    return <Table columns={columns} data={attendances} loading={loading} />;
};
