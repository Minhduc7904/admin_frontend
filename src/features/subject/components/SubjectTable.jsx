import { Edit2, Trash2 } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const SubjectTable = ({ subjects, onEdit, onDelete, loading }) => {
    const columns = [
        {
            key: 'subjectId',
            label: 'ID',
            render: (subject) => (
                <span className="text-sm text-foreground-light">
                    #{subject.subjectId}
                </span>
            )
        },
        {
            key: 'code',
            label: 'Mã môn học',
            render: (subject) => (
                <div className="font-mono text-sm font-medium text-foreground">
                    {subject.code}
                </div>
            )
        },
        {
            key: 'name',
            label: 'Tên môn học',
            render: (subject) => (
                <div className="text-sm font-semibold text-foreground">
                    {subject.name}
                </div>
            )
        },
        {
            key: 'chaptersCount',
            label: 'Số chương',
            render: (subject) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {subject.chaptersCount || 0} chương
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (subject) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Sửa',
                            icon: <Edit2 size={16} />,
                            onClick: () => onEdit(subject),
                        },
                        {
                            label: 'Xóa',
                            icon: <Trash2 size={16} />,
                            onClick: () => onDelete(subject),
                            variant: 'danger',
                        }
                    ]}
                />
            )
        }
    ];

    return (
        <Table
            columns={columns}
            data={subjects}
            loading={loading}
            emptyMessage="Chưa có môn học nào"
            emptySubMessage="Hãy tạo môn học đầu tiên để bắt đầu xây dựng nội dung"
            emptyIcon="book"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    );
};
