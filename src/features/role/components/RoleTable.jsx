import { Edit2, Trash2 } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const RoleTable = ({ roles, onEdit, onDelete, loading }) => {
    const columns = [
        {
            key: 'roleId',
            label: 'ID',
            render: (role) => (
                <span className="text-sm text-foreground-light">#{role.roleId}</span>
            )
        },
        {
            key: 'roleName',
            label: 'Vai trò',
            render: (role) => (
                <div className="font-sm font-semibold text-foreground">{role.roleName}</div>
            )
        },
        {
            key: 'description',
            label: 'Mô tả',
            render: (role) => (
                <div className="text-sm text-foreground-light max-w-xs truncate">
                    {role.description || (
                        <span className="text-foreground-lighter italic">Chưa có mô tả</span>
                    )}
                </div>
            )
        },
        {
            key: 'permissions',
            label: 'Quyền',
            render: (role) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {role.permissionsCount || 0}
                </span>
            )
        },
        {
            key: 'isAssignable',
            label: 'Có thể gán',
            render: (role) =>
                role.isAssignable ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Có
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Không
                    </span>
                )
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (role) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {new Date(role.createdAt).toLocaleDateString('vi-VN', {
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
            render: (role) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Sửa',
                            icon: <Edit2 size={16} />,
                            onClick: () => onEdit(role),
                        },
                        {
                            label: 'Xóa',
                            icon: <Trash2 size={16} />,
                            onClick: () => onDelete(role),
                            variant: 'danger',
                        },
                    ]}
                />
            )
        }
    ];

    return (
        <Table
            columns={columns}
            data={roles}
            loading={loading}
            emptyMessage="Không có vai trò nào"
            emptySubMessage="Hãy tạo vai trò mới để bắt đầu"
            emptyIcon="clipboard_list"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    );
};
