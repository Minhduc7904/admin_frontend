import React from 'react';
import { Card, Pagination } from '@/shared/components/ui';
import { AdminTableRow } from './AdminTableRow';

interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    lastLogin: string;
    createdAt: string;
}

interface AdminTableProps {
    admins: Admin[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onEdit?: (id: string) => void;
    onToggleLock?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
    admins,
    currentPage = 1,
    totalPages = 3,
    onPageChange,
    onEdit,
    onToggleLock,
    onDelete,
}) => {
    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Họ tên
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Email
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Vai trò
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Trạng thái
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Đăng nhập
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Ngày tạo
                            </th>
                            <th className="text-right py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <AdminTableRow
                                key={admin.id}
                                admin={admin}
                                onEdit={onEdit}
                                onToggleLock={onToggleLock}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={admins.length}
                itemsPerPage={admins.length}
                onPageChange={(page) => onPageChange?.(page)}
            />
        </Card>
    );
};
