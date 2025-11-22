import React from 'react';
import { Search } from 'lucide-react';

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
    return (
        <div className="flex gap-3">
            {/* Search */}
            <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none text-sm"
                />
            </div>

            {/* Role Filter */}
            <select
                value={selectedRole}
                onChange={(e) => onRoleChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none text-sm"
            >
                <option value="all">Tất cả vai trò</option>
                <option value="super-admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
            </select>

            {/* Status Filter */}
            <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none text-sm"
            >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="suspended">Bị khóa</option>
            </select>
        </div>
    );
};
