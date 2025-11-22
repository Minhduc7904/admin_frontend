import React from 'react';

interface AdminStatsProps {
    totalAdmins: number;
    activeAdmins: number;
    inactiveAdmins: number;
    suspendedAdmins: number;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
    totalAdmins,
    activeAdmins,
    inactiveAdmins,
    suspendedAdmins,
}) => {
    return (
        <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tổng Admin</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{totalAdmins}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Đang hoạt động</p>
                <p className="text-xl font-bold text-green-600 mt-1">{activeAdmins}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Không hoạt động</p>
                <p className="text-xl font-bold text-gray-600 mt-1">{inactiveAdmins}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Bị khóa</p>
                <p className="text-xl font-bold text-red-600 mt-1">{suspendedAdmins}</p>
            </div>
        </div>
    );
};
