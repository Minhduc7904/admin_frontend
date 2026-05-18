import { Edit2, Trash2 } from 'lucide-react';
import { ActionMenu, Badge, Table } from '../../../shared/components/ui';
import { TAG_TYPE_LABELS } from '../constants/tag.constants';

const formatDateTime = (value) => {
    if (!value) return '-';

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value));
};

export const TagTable = ({ tags, onEdit, onDelete, loading }) => {
    const columns = [
        {
            key: 'tagId',
            label: 'ID',
            render: (tag) => (
                <span className="text-sm text-foreground-light">
                    #{tag.tagId}
                </span>
            ),
        },
        {
            key: 'name',
            label: 'Tag',
            render: (tag) => (
                <div>
                    <div className="text-sm font-semibold text-foreground">
                        {tag.name}
                    </div>
                    <div className="mt-1 font-mono text-xs text-foreground-light">
                        {tag.slug}
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Loại',
            render: (tag) => (
                <Badge variant="info" size="small">
                    {TAG_TYPE_LABELS[tag.type] || tag.type}
                </Badge>
            ),
        },
        {
            key: 'description',
            label: 'Mô tả',
            render: (tag) => (
                <span className="line-clamp-2 text-sm text-foreground-light">
                    {tag.description || '-'}
                </span>
            ),
        },
        {
            key: 'isActive',
            label: 'Trạng thái',
            render: (tag) => (
                <Badge variant={tag.isActive ? 'success' : 'secondary'} size="small">
                    {tag.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}
                </Badge>
            ),
        },
        {
            key: 'updatedAt',
            label: 'Cập nhật',
            render: (tag) => (
                <span className="text-sm text-foreground-light">
                    {formatDateTime(tag.updatedAt)}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (tag) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Sửa',
                            icon: <Edit2 size={16} />,
                            onClick: () => onEdit(tag),
                        },
                        {
                            label: 'Xóa',
                            icon: <Trash2 size={16} />,
                            onClick: () => onDelete(tag),
                            variant: 'danger',
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={tags}
            loading={loading}
            emptyMessage="Chưa có tag nào"
            emptySubMessage="Tạo tag đầu tiên để phân loại tài liệu theo khối lớp, chương, môn học hoặc chủ đề"
            emptyIcon="tag"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    );
};
