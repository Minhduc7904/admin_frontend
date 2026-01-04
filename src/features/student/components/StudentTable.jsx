import { Eye, Trash2, UserX, UserCheck, Edit } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const StudentTable = ({ students, onView, onToggleActivation, loading }) => {
    const columns = [
        {
            key: 'studentId',
            label: 'ID',
            render: (student) => (
                <span className="text-sm text-foreground-light">#{student.studentId}</span>
            )
        },
        {
            key: 'name',
            label: 'Tên học sinh',
            render: (student) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                        {student.fullName}
                    </span>
                    <span className="text-xs text-foreground-lighter">({student.username})</span>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Email',
            render: (student) => {
                if (student.email) return (
                    <div className={`${student.isEmailVerified ? 'text-green-600 ' : 'text-yellow-600'} font-medium flex flex-col text-sm`}>
                        {student.email}
                        {!student.isEmailVerified && (
                            <span className="inline-flex items-center text-xs text-yellow-700">
                                Chưa xác minh
                            </span>
                        )}
                    </div>
                );

                return <span className="italic text-foreground-lighter">Chưa cập nhật</span>;
            }
        },
        {
            key: 'grade',
            label: 'Khối',
            render: (student) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Khối {student.grade}
                </span>
            )
        },
        {
            key: 'school',
            label: 'Trường',
            render: (student) => (
                <div className="text-sm text-foreground-light">
                    {student.school || <span className="italic text-foreground-lighter">Chưa cập nhật</span>}
                </div>
            )
        },
        {
            key: 'studentPhone',
            label: 'SĐT học sinh',
            render: (student) => (
                <div className="text-sm text-foreground-light">
                    {student.studentPhone || <span className="italic text-foreground-lighter">-</span>}
                </div>
            )
        },
        {
            key: 'parentPhone',
            label: 'SĐT phụ huynh',
            render: (student) => (
                <div className="text-sm text-foreground-light">
                    {student.parentPhone || <span className="italic text-foreground-lighter">-</span>}
                </div>
            )
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
                )
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (student) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Xem chi tiết',
                            icon: <Eye size={14} />,
                            onClick: () => onView(student),
                        },
                        {
                            label: student.isActive ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản',
                            icon: student.isActive
                                ? <UserX size={14} />
                                : <UserCheck size={14} />,
                            variant: student.isActive ? 'danger' : 'success',
                            onClick: () => onToggleActivation(student),
                        },
                    ]}
                />
            )
        },
    ];

    return (
        <Table
            columns={columns}
            data={students}
            loading={loading}
            emptyMessage="Không có học sinh nào"
        />
    );
}
