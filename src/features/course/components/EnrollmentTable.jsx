import { Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../core/constants';
import { Table } from '../../../shared/components/ui';

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

const EmptyValue = ({ children = '-' }) => (
    <span className="italic text-foreground-lighter">{children}</span>
);

const formatDate = (value) => {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const EnrollmentTable = ({
    enrollments,
    onEdit,
    onDelete,
    loading,
}) => {
    const columns = [
        {
            key: 'studentId',
            label: 'ID',
            render: (enrollment) => (
                <span className="text-sm text-foreground-light">
                    #{enrollment.student?.studentId || enrollment.studentId}
                </span>
            ),
        },
        {
            key: 'student',
            label: 'Tên học sinh',
            render: (enrollment) => (
                <div className="flex flex-col">
                    <Link
                        to={ROUTES.STUDENT_DETAIL(enrollment.studentId)}
                        className="hover:underline cursor-pointer"
                    >
                        <span className="text-sm font-semibold text-foreground">
                            {enrollment.student?.fullName ||
                                `Học sinh #${enrollment.studentId}`}
                        </span>
                    </Link>
                    {enrollment.student?.username && (
                        <span className="text-xs text-foreground-lighter">
                            ({enrollment.student.username})
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'grade',
            label: 'Khối',
            render: (enrollment) => (
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Khối {enrollment.student?.grade || '-'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        TN {enrollment.student?.highSchoolGraduationYear || '-'}
                    </span>
                </div>
            ),
        },
        {
            key: 'school',
            label: 'Trường',
            render: (enrollment) => (
                <div className="text-sm text-foreground-light">
                    {enrollment.student?.school || <EmptyValue>Chưa cập nhật</EmptyValue>}
                </div>
            ),
        },
        {
            key: 'studentPhone',
            label: 'SĐT học sinh',
            render: (enrollment) => (
                <div className="text-sm text-foreground-light">
                    {enrollment.student?.studentPhone || <EmptyValue />}
                </div>
            ),
        },
        {
            key: 'parentPhone',
            label: 'SĐT phụ huynh',
            render: (enrollment) => (
                <div className="text-sm text-foreground-light">
                    {enrollment.student?.parentPhone || <EmptyValue />}
                </div>
            ),
        },
        {
            key: 'class',
            label: 'Lớp học đã tham gia',
            render: (enrollment) => (
                <div className="text-sm text-foreground-light">
                    {enrollment.student?.classStudents?.length > 0 ? (
                        enrollment.student.classStudents.map((classStudent) => (
                            <div key={classStudent.courseClass?.classId || classStudent.classId}>
                                {classStudent.courseClass?.className || <EmptyValue />}
                            </div>
                        ))
                    ) : (
                        <EmptyValue />
                    )}
                </div>
            ),
        },
        {
            key: 'isActive',
            label: 'Trạng thái HS',
            render: (enrollment) =>
                enrollment.student?.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Hoạt động
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Không hoạt động
                    </span>
                ),
        },
        {
            key: 'studentCreatedAt',
            label: 'Ngày tạo HS',
            render: (enrollment) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {formatDate(enrollment.student?.createdAt)}
                </span>
            ),
        },
        {
            key: 'hasParentZaloId',
            label: 'PH Zalo',
            render: (enrollment) =>
                enrollment.student?.hasParentZaloId ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <UserCheck size={12} />
                        Đã đăng ký
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <UserX size={12} />
                        Chưa đăng ký
                    </span>
                ),
        },
        {
            key: 'status',
            label: 'Trạng thái ghi danh',
            render: (enrollment) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_BADGE[enrollment.status] || STATUS_BADGE.ACTIVE
                    }`}
                >
                    {STATUS_LABEL[enrollment.status] || enrollment.status || '-'}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Ngày ghi danh',
            render: (enrollment) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {formatDate(enrollment.enrolledAt || enrollment.createdAt)}
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
            emptyMessage="Chưa có học sinh nào"
            emptyIcon="users"
            emptySubMessage="Khóa học này hiện chưa có học sinh ghi danh"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    );
};
