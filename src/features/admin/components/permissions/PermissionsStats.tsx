import React from 'react';

interface PermissionsStatsProps {
    totalModules: number;
    totalPermissions: number;
    activePermissions: number;
    inactivePermissions: number;
}

export const PermissionsStats: React.FC<PermissionsStatsProps> = ({
    totalModules,
    totalPermissions,
    activePermissions,
    inactivePermissions,
}) => {
    return (
        <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tổng Module</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{totalModules}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tổng Quyền</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{totalPermissions}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Hoạt động</p>
                <p className="text-xl font-bold text-green-600 mt-1">{activePermissions}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tắt</p>
                <p className="text-xl font-bold text-gray-600 mt-1">{inactivePermissions}</p>
            </div>
        </div>
    );
};
