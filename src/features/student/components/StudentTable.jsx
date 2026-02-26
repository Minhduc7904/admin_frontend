import { Eye, UserX, UserCheck, ClipboardCheck } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';
import { COURSE_ENROLLMENT_STATUS_CONFIG } from '../../courseEnrollment/constants/course-enrollment.constant';

/* ===================== STUDENT TABLE ===================== */
export const StudentTable = ({
    students,
    onView,
    onToggleActivation,
    onQuickAttendance,
    loading,
    sort,
    onSortChange,
}) => {
    const columns = [
        {
            key: 'studentId',
            label: 'ID',
            sortDirection: sort?.field === 'studentId' ? sort.direction : null,
            onSort: (direction) => onSortChange('studentId', direction),
            render: (student) => (
                <span className="text-sm text-foreground-light">
                    #{student.studentId}
                </span>
            ),
        },
        {
            key: 'name',
            label: 'Tên học sinh',
            render: (student) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                        {student.fullName}
                    </span>
                    <span className="text-xs text-foreground-lighter">
                        ({student.username})
                    </span>
                </div>
            ),
        },
        {
            key: 'grade',
            label: 'Khối',
            sortDirection: sort?.field === 'grade' ? sort.direction : null,
            onSort: (direction) => onSortChange('grade', direction),
            render: (student) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Khối {student.grade}
                </span>
            ),
        },
        {
            key: 'school',
            label: 'Trường',
            render: (student) => (
                <div className="text-sm text-foreground-light">
                    {student.school || (
                        <span className="italic text-foreground-lighter">
                            Chưa cập nhật
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'studentPhone',
            label: 'SĐT học sinh',
            render: (student) => (
                <div className="text-sm text-foreground-light">
                    {student.studentPhone || (
                        <span className="italic text-foreground-lighter">-</span>
                    )}
                </div>
            ),
        },
        {
            key: 'parentPhone',
            label: 'SĐT phụ huynh',
            render: (student) => (
                <div className="text-sm text-foreground-light">
                    {student.parentPhone || (
                        <span className="italic text-foreground-lighter">-</span>
                    )}
                </div>
            ),
        },
        {
            key: 'class',
            label: 'Lớp học đã tham gia',
            render: (student) => (
                <div className="text-sm text-foreground-light">
                    {student.classStudents && student.classStudents.length > 0 ? (
                        student.classStudents.map((classStudent) => (
                            <div key={classStudent.courseClass.classId}>
                                {classStudent.courseClass.className}
                            </div>
                        ))
                    ) : (
                        <span className="italic text-foreground-lighter">-</span>
                    )}
                </div>
            ),
        },
        {
            key: 'isActive',
            label: 'Trạng thái',
            render: (student) =>
                student.isActive ? (
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
            key: 'createdAt',
            label: 'Ngày tạo',
            sortDirection: sort?.field === 'createdAt' ? sort.direction : null,
            onSort: (direction) => onSortChange('createdAt', direction),
            render: (student) => (
                <span className="text-sm text-foreground-light">
                    {new Date(student.createdAt).toLocaleDateString('vi-VN')}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (student) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onView?.(student)
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} className="text-info" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onQuickAttendance?.(student)
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Điểm danh nhanh"
                    >
                        <ClipboardCheck size={16} className="text-success" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleActivation?.(student)
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title={student.isActive ? 'Deactive student' : 'Activate student'}
                    >
                        {student.isActive ? (
                            <UserX size={16} className="text-error" />
                        ) : (
                            <UserCheck size={16} className="text-success" />
                        )}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={students}
            loading={loading}
            emptyMessage="Không có học sinh nào"
            emptySubMessage="Chưa có học sinh nào được thêm vào hệ thống"
            emptyIcon="users"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    );
};
