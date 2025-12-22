import React from 'react';

interface StudentStatsProps {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    suspendedStudents: number;
}

export const StudentStats: React.FC<StudentStatsProps> = ({
    totalStudents,
    activeStudents,
    inactiveStudents,
    suspendedStudents,
}) => {
    return (
        <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tổng Học sinh</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{totalStudents}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Đang học</p>
                <p className="text-xl font-bold text-green-600 mt-1">{activeStudents}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Nghỉ học</p>
                <p className="text-xl font-bold text-gray-600 mt-1">{inactiveStudents}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Đình chỉ</p>
                <p className="text-xl font-bold text-red-600 mt-1">{suspendedStudents}</p>
            </div>
        </div>
    );
};
