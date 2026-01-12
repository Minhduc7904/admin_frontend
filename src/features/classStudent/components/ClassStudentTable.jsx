import { Trash2 } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const ClassStudentTable = ({
    classStudents,
    onDelete,
    loading,
}) => {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (classStudent) => (
                <span className="text-sm text-foreground-light">
                    #{classStudent.studentId}
                </span>
            ),
        },
        {
            key: 'student',
            label: 'Học sinh',
            render: (classStudent) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                        {classStudent.student?.fullName ||
                            `Học sinh #${classStudent.studentId}`}
                    </span>
                    {classStudent.student?.email && (
                        <span className="text-xs text-foreground-light">
                            {classStudent.student.email}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'studentCode',
            label: 'Mã học sinh',
            render: (classStudent) => (
                <span className="text-sm text-foreground-light">
                    {classStudent.student?.studentId || 'N/A'}
                </span>
            ),
        },
        {
            key: 'phone',
            label: 'SĐT Học sinh/ Phụ huynh',
            render: (classStudent) => (
                <div className="flex flex-col">
                    <span className="text-sm text-foreground-light">
                        {classStudent.student?.studentPhone || 'N/A'}
                    </span>
                    <span className="text-sm text-foreground-light">
                        {classStudent.student?.parentPhone || 'N/A'}
                    </span>
                </div>

            ),
        },
        {
            key: 'school',
            label: 'Trường',
            render: (classStudent) => (
                <span className="text-sm text-foreground-light">
                    {classStudent.student?.school || 'N/A'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (classStudent) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(classStudent);
                    }}
                    className="p-1 rounded hover:bg-red-100 transition-colors"
                    title="Xóa ghi danh"
                >
                    <Trash2
                        size={16}
                        className='text-red-600'
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
            emptyMessage="Chưa có học sinh nào trong lớp"
        />
    );
};
