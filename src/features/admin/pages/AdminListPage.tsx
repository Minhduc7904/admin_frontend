import React, { useState } from 'react';
import { AdminManagementLayout } from '@/shared/layouts/AdminManagementLayout';
import {
    AdminPageHeader,
    AdminFilters,
    AdminStats,
    AdminTable,
} from '@/features/admin/components/list';

interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    lastLogin: string;
    createdAt: string;
}

export const AdminListPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Mock data
    const admins: Admin[] = [
        {
            id: '1',
            name: 'Nguyễn Văn A',
            email: 'admin@example.com',
            role: 'Super Admin',
            status: 'active',
            lastLogin: '2 phút trước',
            createdAt: '15/01/2025',
        },
        {
            id: '2',
            name: 'Trần Thị B',
            email: 'tranb@example.com',
            role: 'Admin',
            status: 'active',
            lastLogin: '1 giờ trước',
            createdAt: '10/01/2025',
        },
        {
            id: '3',
            name: 'Lê Văn C',
            email: 'levanc@example.com',
            role: 'Moderator',
            status: 'inactive',
            lastLogin: '2 ngày trước',
            createdAt: '05/01/2025',
        },
        {
            id: '4',
            name: 'Phạm Thị D',
            email: 'phamd@example.com',
            role: 'Admin',
            status: 'active',
            lastLogin: '30 phút trước',
            createdAt: '20/12/2024',
        },
        {
            id: '5',
            name: 'Hoàng Văn E',
            email: 'hoange@example.com',
            role: 'Moderator',
            status: 'suspended',
            lastLogin: '1 tuần trước',
            createdAt: '15/12/2024',
        },
        {
            id: '6',
            name: 'Đỗ Thị F',
            email: 'dothif@example.com',
            role: 'Admin',
            status: 'active',
            lastLogin: '5 phút trước',
            createdAt: '10/12/2024',
        },
        {
            id: '7',
            name: 'Vũ Văn G',
            email: 'vuvang@example.com',
            role: 'Super Admin',
            status: 'active',
            lastLogin: '15 phút trước',
            createdAt: '01/12/2024',
        },
        {
            id: '8',
            name: 'Mai Thị H',
            email: 'maih@example.com',
            role: 'Moderator',
            status: 'active',
            lastLogin: '3 giờ trước',
            createdAt: '25/11/2024',
        },
    ];

    // Handlers
    const handleAddAdmin = () => {
        console.log('Add admin clicked');
    };

    const handleEdit = (id: string) => {
        console.log('Edit admin:', id);
    };

    const handleToggleLock = (id: string) => {
        console.log('Toggle lock admin:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete admin:', id);
    };


    return (
        <AdminManagementLayout>
            <AdminPageHeader onAddClick={handleAddAdmin} />

            <AdminFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
            />

            <AdminStats
                totalAdmins={admins.length}
                activeAdmins={admins.filter((a) => a.status === 'active').length}
                inactiveAdmins={admins.filter((a) => a.status === 'inactive').length}
                suspendedAdmins={admins.filter((a) => a.status === 'suspended').length}
            />

            <AdminTable
                admins={admins}
                onEdit={handleEdit}
                onToggleLock={handleToggleLock}
                onDelete={handleDelete}
            />
        </AdminManagementLayout>
    );
};
