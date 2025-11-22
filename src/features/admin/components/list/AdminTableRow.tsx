import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Lock, Eye, MoreVertical } from 'lucide-react';
import { ROUTES } from '@/core/constants';

interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    lastLogin: string;
    createdAt: string;
}

interface AdminTableRowProps {
    admin: Admin;
    onEdit?: (id: string) => void;
    onToggleLock?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const getStatusColor = (status: Admin['status']) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'inactive':
            return 'bg-gray-100 text-gray-700';
        case 'suspended':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: Admin['status']) => {
    switch (status) {
        case 'active':
            return 'Hoạt động';
        case 'inactive':
            return 'Không hoạt động';
        case 'suspended':
            return 'Bị khóa';
        default:
            return status;
    }
};

const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case 'Super Admin':
            return 'bg-purple-100 text-purple-700';
        case 'Admin':
            return 'bg-blue-100 text-blue-700';
        case 'Moderator':
            return 'bg-orange-100 text-orange-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export const AdminTableRow: React.FC<AdminTableRowProps> = ({
    admin,
    onEdit,
    onToggleLock,
    onDelete,
}) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                            {admin.name.charAt(0)}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        {admin.name}
                    </span>
                </div>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{admin.email}</span>
            </td>
            <td className="py-2 px-3">
                <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(
                        admin.role
                    )}`}
                >
                    {admin.role}
                </span>
            </td>
            <td className="py-2 px-3">
                <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                        admin.status
                    )}`}
                >
                    {getStatusText(admin.status)}
                </span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{admin.lastLogin}</span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{admin.createdAt}</span>
            </td>
            <td className="py-2 px-3">
                <div className="flex items-center justify-end relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Thao tác"
                    >
                        <MoreVertical size={14} className="text-gray-600" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                            <button
                                onClick={() => {
                                    navigate(`/admin/detail/${admin.id}`);
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Eye size={14} className="text-gray-600" />
                                <span>Xem chi tiết</span>
                            </button>
                            <button
                                onClick={() => {
                                    onEdit?.(admin.id);
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Edit2 size={14} className="text-gray-600" />
                                <span>Chỉnh sửa</span>
                            </button>
                            <button
                                onClick={() => {
                                    onToggleLock?.(admin.id);
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Lock size={14} className="text-gray-600" />
                                <span>Khóa/Mở khóa</span>
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                                onClick={() => {
                                    onDelete?.(admin.id);
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={14} className="text-red-600" />
                                <span>Xóa</span>
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};
