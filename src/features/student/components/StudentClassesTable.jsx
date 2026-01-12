import { Trash2 } from 'lucide-react';
import { Table } from '../../../shared/components/ui';

export const StudentClassesTable = ({
    classStudents,
    loading,
    onDelete,
}) => {
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
                        {classStudent.courseClass?.className || 'N/A'}
                    </span>
                    <span className="text-xs text-foreground-light">
                        {classStudent.courseClass?.course?.title || ''}
                    </span>
                </div>
            ),
        },
        // {
        //     key: 'course',
        //     label: 'Khóa học',
        //     render: (classStudent) => (
        //         <div className="flex flex-col">
        //             <span className="text-sm text-foreground-light">
        //                 {classStudent.courseClass?.course?.title || 'N/A'}
        //             </span>
        //             {classStudent.courseClass?.course?.subjectName && (
        //                 <span className="text-xs text-foreground-light">
        //                     {classStudent.courseClass.course.subjectName}
        //                 </span>
        //             )}
        //         </div>
        //     ),
        // },
        // {
        //     key: 'instructor',
        //     label: 'Giáo viên',
        //     render: (classStudent) => (
        //         <span className="text-sm text-foreground-light">
        //             {classStudent.courseClass?.instructor?.fullName || 'N/A'}
        //         </span>
        //     ),
        // },
        {
            key: 'room',
            label: 'Phòng học',
            render: (classStudent) => (
                <span className="text-sm text-foreground-light">
                    {classStudent.courseClass?.room || 'N/A'}
                </span>
            ),
        },
        {
            key: 'schedule',
            label: 'Thời gian',
            render: (classStudent) => (
                <div className="flex flex-col text-sm text-foreground-light">
                    {classStudent.courseClass?.startDate && (
                        <span>{new Date(classStudent.courseClass.startDate).toLocaleDateString('vi-VN')}</span>
                    )}
                    {classStudent.courseClass?.endDate && (
                        <span>- {new Date(classStudent.courseClass.endDate).toLocaleDateString('vi-VN')}</span>
                    )}
                </div>
            ),
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
