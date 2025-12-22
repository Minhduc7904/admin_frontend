import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, MoreVertical, CheckCircle, XCircle, DollarSign, Eye } from 'lucide-react';

export interface AttendanceRecord {
    id: string;
    studentName: string;
    studentCode: string;
    studentClass: string;
    studentPhone: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    homeworkScore: number | null;
    isPaidTuition: boolean;
    date: string;
}

interface AttendanceTableRowProps {
    record: AttendanceRecord;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
        case 'present':
            return 'bg-green-100 text-green-700';
        case 'absent':
            return 'bg-red-100 text-red-700';
        case 'late':
            return 'bg-orange-100 text-orange-700';
        case 'excused':
            return 'bg-blue-100 text-blue-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: AttendanceRecord['status']) => {
    switch (status) {
        case 'present':
            return 'Có mặt';
        case 'absent':
            return 'Vắng';
        case 'late':
            return 'Muộn';
        case 'excused':
            return 'Có phép';
        default:
            return status;
    }
};

export const AttendanceTableRow: React.FC<AttendanceTableRowProps> = ({
    record,
    onView,
    onEdit,
    onDelete,
}) => {
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
                <span className="text-xs font-medium text-gray-900">{record.id}</span>
            </td>
            <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                            {record.studentName.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-900 block">
                            {record.studentName}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span>{record.studentCode}</span>
                            <span>•</span>
                            <span>{record.studentClass}</span>
                            <span>•</span>
                            <span>{record.studentPhone}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="py-2 px-3">
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getStatusColor(record.status)}`}>
                    {getStatusText(record.status)}
                </span>
            </td>
            <td className="py-2 px-3">
                {record.homeworkScore !== null ? (
                    <span className="text-xs font-medium text-gray-900">{record.homeworkScore}/10</span>
                ) : (
                    <span className="text-xs text-gray-400">Chưa chấm</span>
                )}
            </td>
            <td className="py-2 px-3">
                <div className="flex items-center gap-1">
                    {record.isPaidTuition ? (
                        <>
                            <CheckCircle size={14} className="text-green-600" />
                            <span className="text-xs text-green-600">Đã đóng</span>
                        </>
                    ) : (
                        <>
                            <XCircle size={14} className="text-red-600" />
                            <span className="text-xs text-red-600">Chưa đóng</span>
                        </>
                    )}
                </div>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{record.date}</span>
            </td>
            <td className="py-2 px-3 w-16">
                <div className="flex items-center justify-center" ref={dropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        >
                            <MoreVertical size={14} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => {
                                        onView?.(record.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Eye size={12} />
                                    Xem chi tiết
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit?.(record.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit2 size={12} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.(record.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 size={12} />
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};
