import { Edit2, Trash2 } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const PermissionTable = ({ permissions, onEdit, onDelete, loading }) => {
    const columns = [
        {
            key: 'permissionId',
            label: 'ID',
            render: (permission) => (
                <span className="text-sm text-foreground-light">#{permission.permissionId}</span>
            )
        },
        {
            key: 'code',
            label: 'Mã quyền',
            render: (permission) => (
                <div className="font-mono text-sm font-medium text-foreground">
                    {permission.code}
                </div>
            )
        },
        {
            key: 'name',
            label: 'Tên quyền',
            render: (permission) => (
                <div className="text-sm font-semibold text-foreground">
                    {permission.name}
                </div>
            )
        },
        {
            key: 'group',
            label: 'Nhóm',
            render: (permission) => (
                permission.group ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {permission.group}
                    </span>
                ) : (
                    <span className="text-foreground-lighter italic text-sm">Không có nhóm</span>
                )
            )
        },
        {
            key: 'description',
            label: 'Mô tả',
            render: (permission) => (
                <div className="text-sm text-foreground-light max-w-xs truncate">
                    {permission.description || (
                        <span className="text-foreground-lighter italic">Chưa có mô tả</span>
                    )}
                </div>
            )
        },
        {
            key: 'isSystem',
            label: 'Hệ thống',
            render: (permission) =>
                permission.isSystem ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        System
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Custom
                    </span>
                )
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (permission) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {new Date(permission.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    })}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (permission) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Sửa',
                            icon: <Edit2 size={16} />,
                            onClick: () => onEdit(permission),
                        },
                        {
                            label: 'Xóa',
                            icon: <Trash2 size={16} />,
                            onClick: () => onDelete(permission),
                            variant: 'danger',
                            disabled: permission.isSystem,
                        },
                    ]}
                />
            )
        }
    ];

    return (
        <Table
            columns={columns}
            data={permissions}
            loading={loading}
            emptyMessage="Không có quyền nào"
            emptyIcon="shield_check"
            emptySubMessage="Chưa có quyền nào được tạo trong hệ thống"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    );
};
