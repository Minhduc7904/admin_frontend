import { Edit2, Trash2 } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

/* ===================== STATUS BADGE MAP ===================== */
const STATUS_BADGE = {
    ACTIVE: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
    ACTIVE: 'Đang học',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Hủy',
};

export const EnrollmentTable = ({
    enrollments,
    onEdit,
    onDelete,
    loading,
}) => {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (enrollment) => (
                <span className="text-sm text-foreground-light">
                    #{enrollment.id}
                </span>
            ),
        },
        {
            key: 'student',
            label: 'Học viên',
            render: (enrollment) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                        {enrollment.student?.fullName ||
                            `Học viên #${enrollment.studentId}`}
                    </span>
                    {enrollment.student?.email && (
                        <span className="text-xs text-foreground-light">
                            {enrollment.student.email}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (enrollment) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[enrollment.status]
                        }`}
                >
                    {STATUS_LABEL[enrollment.status]}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Ngày ghi danh',
            render: (enrollment) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {new Date(enrollment.enrolledAt || enrollment.createdAt)
                        .toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        })}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (enrollment) => (
                <div className="flex items-center justify-end gap-2">

                    {/* Edit */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(enrollment);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Cập nhật trạng thái"
                    >
                        <Edit2 size={16} className="text-warning" />
                    </button>

                    {/* Delete */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(enrollment);
                        }}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                        title="Xóa ghi danh"
                        disabled={enrollment.status === 'COMPLETED'}
                    >
                        <Trash2
                            size={16}
                            className={
                                enrollment.status === 'COMPLETED'
                                    ? 'text-gray-400'
                                    : 'text-red-600'
                            }
                        />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={enrollments}
            loading={loading}
            emptyMessage="Chưa có học viên nào"
            emptyIcon="users"
            emptySubMessage="Khóa học này hiện chưa có học viên ghi danh"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    );
};