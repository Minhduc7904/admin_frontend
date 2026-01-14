import { Eye, Calendar } from 'lucide-react';
import { Table } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils';

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

export const CourseStudentsAttendanceTable = ({
    studentsAttendance = [],
    loading = false,
    onViewStudent,
    hasDateFilter = false,
}) => {
    if (!hasDateFilter) {
        return null;
    }

    const columns = [
        {
            key: 'stt',
            label: 'STT',
            render: (student, index) => (
                <span className="text-sm text-foreground">
                    {index + 1}
                </span>
            ),
        },
        {
            key: 'studentId',
            label: 'Mã HS',
            render: (student) => (
                <span className="text-sm font-medium text-foreground">
                    {student.studentId}
                </span>
            ),
        },
        {
            key: 'name',
            label: 'Họ tên',
            render: (student) => (
                <div>
                    <span className="text-sm font-medium text-foreground">
                        {student.lastName} {student.firstName}
                    </span>
                    {student.email && (
                        <p className="text-xs text-foreground-light">
                            {student.email}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'grade',
            label: 'Lớp',
            render: (student) => (
                <span className="text-sm text-foreground">
                    {student.grade ? `Lớp ${student.grade}` : '-'}
                </span>
            ),
        },
        {
            key: 'school',
            label: 'Trường',
            render: (student) => (
                <span className="text-sm text-foreground-light">
                    {student.school || '-'}
                </span>
            ),
        },
        {
            key: 'attendances',
            label: 'Các buổi học',
            render: (student) => {
                if (!student.attendances || student.attendances.length === 0) {
                    return <span className="text-sm text-foreground-light">-</span>;
                }

                return (
                    <div className="flex flex-col gap-2 py-1">
                        {student.attendances.map((attendance) => (
                            <div key={attendance.sessionId} className="flex items-start gap-2">
                                <Calendar size={14} className="text-foreground-light mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-medium text-foreground">
                                            {attendance.sessionName} - {attendance.className}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[attendance.status]}`}
                                        >
                                            {STATUS_LABEL[attendance.status] || '-'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground-light">
                                        {formatDateTime(attendance.sessionDate)} •{' '}
                                        {new Date(attendance.startTime).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}{' '}
                                        -{' '}
                                        {new Date(attendance.endTime).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                    {attendance.notes && (
                                        <p className="text-xs text-foreground-light italic">
                                            {attendance.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            render: (student) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewStudent(student);
                        }}
                        className="p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} className="text-blue-600" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={studentsAttendance}
            loading={loading}
            emptyMessage="Không có dữ liệu điểm danh"
        />
    );
};
