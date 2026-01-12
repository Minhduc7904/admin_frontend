import { Edit2, Trash2 } from 'lucide-react';
import { Table } from '../../../shared/components/ui';

/* ===================== ENUM MAP ===================== */
const ENROLLMENT_STATUS = {
    ACTIVE: 'Đang học',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Hủy',
};

export const StudentCoursesTable = ({
    enrollments,
    loading,
    onEdit,
    onDelete,
}) => {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (enrollment) => (
                <span className="text-sm text-foreground-light">
                    #{enrollment.enrollmentId}
                </span>
            ),
        },
        {
            key: 'course',
            label: 'Khóa học',
            render: (enrollment) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                        {enrollment.course?.title || 'N/A'}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-foreground-light">
                        {enrollment.course?.subjectName && (
                            <span>{enrollment.course.subjectName}</span>
                        )}
                        {enrollment.course?.grade && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                Khối {enrollment.course.grade}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'teacher',
            label: 'Giáo viên',
            render: (enrollment) => (
                <span className="text-sm text-foreground-light">
                    {enrollment.course?.teacherName || 'N/A'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (enrollment) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        enrollment.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                        enrollment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                    }`}
                >
                    {ENROLLMENT_STATUS[enrollment.status]}
                </span>
            ),
        },
        {
            key: 'enrolledAt',
            label: 'Ngày đăng ký',
            render: (enrollment) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            render: (enrollment) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(enrollment);
                        }}
                        className="p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(enrollment);
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
            data={enrollments}
            loading={loading}
            emptyMessage="Chưa có khóa học nào"
        />
    );
};
