import { Eye, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const ClassTable = ({ classes, onView, onEdit, onDelete, loading }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(dateString));
    };

    const getStatusBadge = (classItem) => {
        const now = new Date();
        const startDate = classItem.startDate ? new Date(classItem.startDate) : null;
        const endDate = classItem.endDate ? new Date(classItem.endDate) : null;

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
            key: 'classId',
            label: 'ID',
            render: (classItem) => (
                <span className="text-sm text-foreground-light">#{classItem.classId}</span>
            )
        },
        {
            key: 'className',
            label: 'Tên lớp',
            render: (classItem) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                        {classItem.className}
                    </span>
                    {classItem.room && (
                        <div className="flex items-center gap-1 text-xs text-foreground-light mt-1">
                            <MapPin size={12} />
                            <span>{classItem.room}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'course',
            label: 'Khóa học',
            render: (classItem) => (
                <div className="flex flex-col max-w-xs">
                    <span className="text-sm font-medium text-foreground truncate">
                        {classItem.course?.title || <span className="italic text-foreground-lighter">Chưa có</span>}
                    </span>
                    {classItem.course?.subjectName && (
                        <span className="text-xs text-foreground-light">
                            {classItem.course.subjectName}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'instructor',
            label: 'Giáo viên',
            render: (classItem) => (
                <div className="text-sm text-foreground-light">
                    {classItem.instructor?.fullName || <span className="italic text-foreground-lighter">Chưa có</span>}
                </div>
            )
        },
        {
            key: 'schedule',
            label: 'Lịch học',
            render: (classItem) => (
                <div className="flex items-start gap-1 text-sm text-foreground-light max-w-xs">
                    <Calendar size={14} className="mt-0.5 shrink-0" />
                    <span className="break-words">
                        {classItem.weeklySchedule || <span className="italic text-foreground-lighter">Chưa có</span>}
                    </span>
                </div>
            )
        },
        {
            key: 'dateRange',
            label: 'Thời gian',
            render: (classItem) => (
                <div className="flex flex-col text-xs">
                    <div className="flex items-center gap-1 text-foreground-light">
                        <span className="font-medium">Bắt đầu:</span>
                        <span>{formatDate(classItem.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground-light">
                        <span className="font-medium">Kết thúc:</span>
                        <span>{formatDate(classItem.endDate)}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (classItem) => getStatusBadge(classItem)
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (classItem) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Xem chi tiết',
                            icon: <Eye size={14} />,
                            onClick: () => onView(classItem),
                        },
                        {
                            label: 'Chỉnh sửa',
                            icon: <Edit size={14} />,
                            onClick: () => onEdit(classItem),
                        },
                        {
                            label: 'Xóa lớp học',
                            icon: <Trash2 size={14} />,
                            variant: 'danger',
                            onClick: () => onDelete(classItem),
                        },
                    ]}
                />
            )
        },
    ];

    return (
        <Table
            columns={columns}
            data={classes}
            loading={loading}
            emptyMessage="Không có lớp học nào"
            emptySubMessage="Chưa có lớp học nào được thêm vào hệ thống"
            emptyIcon="users"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
            onRowClick={(classItem) => onView(classItem)}
        />
    );
}
