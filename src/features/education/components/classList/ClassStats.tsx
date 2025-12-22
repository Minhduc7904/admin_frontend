import React from 'react';

interface ClassStatsProps {
    totalClasses: number;
    activeClasses: number;
    completedClasses: number;
    archivedClasses: number;
}

export const ClassStats: React.FC<ClassStatsProps> = ({
    totalClasses,
    activeClasses,
    completedClasses,
    archivedClasses,
}) => {
    return (
        <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tổng Lớp học</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{totalClasses}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Đang hoạt động</p>
                <p className="text-xl font-bold text-green-600 mt-1">{activeClasses}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Đã hoàn thành</p>
                <p className="text-xl font-bold text-blue-600 mt-1">{completedClasses}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Lưu trữ</p>
                <p className="text-xl font-bold text-gray-600 mt-1">{archivedClasses}</p>
            </div>
        </div>
    );
};
