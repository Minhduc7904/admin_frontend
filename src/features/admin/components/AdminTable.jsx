import { Eye, Trash2 } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const AdminTable = ({ admins, onView, onDelete, loading }) => {
    const columns = [
        {
            key: 'adminId',
            label: 'ID',
            render: (admin) => (
                <span className="text-sm text-foreground-light">#{admin.adminId}</span>
            )
        },
        {
            key: 'name',
            label: 'Tên quản trị viên',
            render: (admin) => (
                <div className="flex flex-col  text-sm font-semibold text-foreground">
                    {admin.fullName}
                    <span className=" text-xs text-foreground-lighter">({admin.username})</span>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Vai trò',
            render: (admin) => {
                return admin.roles && admin.roles.length > 0 ? (
                    admin.roles.map((role) => (
                        <span
                            key={role.roleId}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 mr-1 mb-1"
                        >
                            {role.roleName}
                        </span>
                    ))
                ) : (
                    <span className="text-foreground-lighter italic text-sm">Chưa có vai trò</span>
                );
            }
        },
        {
            key: 'email',
            label: 'Email',
            render: (admin) => (
                <div className="text-sm text-foreground-light">
                    {admin.email}
                </div>
            )
        },
        {
            key: 'isActive',
            label: 'Trạng thái',
            render: (admin) =>
                admin.isActive ? (
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
            render: (admin) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Xem chi tiết',
                            icon: <Eye size={14} />,
                            onClick: () => onView(admin),
                        },
                        {
                            label: 'Xóa quản trị viên',
                            icon: <Trash2 size={14} />,
                            variant: 'danger',
                            onClick: () => onDelete(admin),
                        },
                    ]}
                />
            )
        },
    ];
    return (
        <Table
            columns={columns}
            data={admins}
            loading={loading}
            emptyMessage="Không có quản trị viên nào"
        />
    );
}