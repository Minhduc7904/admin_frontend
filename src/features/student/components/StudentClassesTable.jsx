import { Calendar, MapPin, Trash2 } from 'lucide-react';
import { Table } from '../../../shared/components/ui';

export const StudentClassesTable = ({
    classStudents,
    loading,
    onDelete,
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date(dateString));
    };

    const getStatusBadge = (courseClass) => {
        const now = new Date();
        const startDate = courseClass?.startDate ? new Date(courseClass.startDate) : null;
        const endDate = courseClass?.endDate ? new Date(courseClass.endDate) : null;

        let status = '';
        let badgeClass = '';

        if (!startDate) {
            status = 'Chưa có lịch';
            badgeClass = 'bg-gray-100 text-gray-700';
        } else if (startDate > now) {
            status = 'Sắp diễn ra';
            badgeClass = 'bg-blue-100 text-blue-700';
        } else if (!endDate || endDate >= now) {
            status = 'Đang diễn ra';
            badgeClass = 'bg-green-100 text-green-700';
        } else {
            status = 'Đã kết thúc';
            badgeClass = 'bg-gray-100 text-gray-700';
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                {status}
            </span>
        );
    };

    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (classStudent) => (
                <span className="text-sm text-foreground-light">
                    #{classStudent.classId}
                </span>
            ),
        },
        {
            key: 'class',
            label: 'Lớp học',
            render: (classStudent) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                        {classStudent.courseClass?.className || <span className="italic text-foreground-lighter">Chưa có</span>}
                    </span>
                    {classStudent.courseClass?.room && (
                        <div className="flex items-center gap-1 text-xs text-foreground-light mt-1">
                            <MapPin size={12} />
                            <span>{classStudent.courseClass.room}</span>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'course',
            label: 'Khóa học',
            render: (classStudent) => (
                <div className="flex flex-col max-w-xs">
                    <span className="text-sm font-medium text-foreground truncate">
                        {classStudent.courseClass?.course?.title || <span className="italic text-foreground-lighter">Chưa có</span>}
                    </span>
                    {classStudent.courseClass?.course?.subjectName && (
                        <span className="text-xs text-foreground-light">
                            {classStudent.courseClass.course.subjectName}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'instructor',
            label: 'Giáo viên',
            render: (classStudent) => (
                <div className="text-sm text-foreground-light">
                    {classStudent.courseClass?.instructor?.fullName || <span className="italic text-foreground-lighter">Chưa có</span>}
                </div>
            ),
        },
        {
            key: 'schedule',
            label: 'Lịch học',
            render: (classStudent) => (
                <div className="flex items-start gap-1 text-sm text-foreground-light max-w-xs">
                    <Calendar size={14} className="mt-0.5 shrink-0" />
                    <span className="break-words">
                        {classStudent.courseClass?.weeklySchedule || <span className="italic text-foreground-lighter">Chưa có</span>}
                    </span>
                </div>
            ),
        },
        {
            key: 'dateRange',
            label: 'Thời gian',
            render: (classStudent) => (
                <div className="flex flex-col text-xs">
                    <div className="flex items-center gap-1 text-foreground-light">
                        <span className="font-medium">Bắt đầu:</span>
                        <span>{formatDate(classStudent.courseClass?.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground-light">
                        <span className="font-medium">Kết thúc:</span>
                        <span>{formatDate(classStudent.courseClass?.endDate)}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (classStudent) => getStatusBadge(classStudent.courseClass),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            render: (classStudent) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(classStudent);
                    }}
                    className="p-1 rounded hover:bg-red-100 transition-colors"
                    title="Xóa"
                >
                    <Trash2
                        size={16}
                        className="text-red-600"
                    />
                </button>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={classStudents}
            loading={loading}
            emptyMessage="Chưa tham gia lớp học nào"
        />
    );
};
