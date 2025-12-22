import React from 'react';
import { Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface AdminFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedRole: string;
    onRoleChange: (role: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
}

export const AdminFilters: React.FC<AdminFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedRole,
    onRoleChange,
    selectedStatus,
    onStatusChange,
}) => {
    // Role options
    const roleOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả vai trò' },
        { value: 'super-admin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'moderator', label: 'Moderator' },
    ];

    // Status options
    const statusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
        { value: 'suspended', label: 'Bị khóa' },
    ];

    return (
        <div className="flex gap-3">
            {/* Search */}
            <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Tìm kiếm theo tên, email..."
                className="flex-1"
            />

            {/* Role Filter */}
            <Dropdown
                options={roleOptions}
                value={selectedRole}
                onChange={onRoleChange}
            />

            {/* Status Filter */}
            <Dropdown
                options={statusOptions}
                value={selectedStatus}
                onChange={onStatusChange}
            />
        </div>
    );
};
