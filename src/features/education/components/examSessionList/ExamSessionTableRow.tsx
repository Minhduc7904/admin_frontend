import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, MoreVertical, Eye } from 'lucide-react';

export interface ExamSession {
    id: string;
    title: string;
    examCode: string;
    examTitle: string;
    startDate: string;
    endDate: string;
    duration: number; // in minutes
    participantCount: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

interface ExamSessionTableRowProps {
    session: ExamSession;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const getStatusColor = (status: ExamSession['status']) => {
    switch (status) {
        case 'upcoming':
            return 'bg-orange-100 text-orange-700';
        case 'ongoing':
            return 'bg-green-100 text-green-700';
        case 'completed':
            return 'bg-gray-100 text-gray-700';
        case 'cancelled':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: ExamSession['status']) => {
    switch (status) {
        case 'upcoming':
            return 'Sắp diễn ra';
        case 'ongoing':
            return 'Đang diễn ra';
        case 'completed':
            return 'Đã kết thúc';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return status;
    }
};

export const ExamSessionTableRow: React.FC<ExamSessionTableRowProps> = ({
    session,
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
            <td className="py-3 px-4">
                <div>
                    <div className="text-sm font-medium text-gray-900">{session.title}</div>
                    <div className="text-xs text-gray-500">{session.examCode} - {session.examTitle}</div>
                </div>
            </td>
            <td className="py-3 px-4">
                <div className="text-xs">
                    <div className="text-gray-900">{session.startDate}</div>
                    <div className="text-gray-500">{session.endDate}</div>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-gray-900">{session.duration} phút</span>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-gray-900">{session.participantCount}</span>
            </td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                    {getStatusText(session.status)}
                </span>
            </td>
            <td className="py-3 px-4 w-16">
                <div className="flex items-center justify-center" ref={dropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        >
                            <MoreVertical size={16} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => {
                                        onView?.(session.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Eye size={12} />
                                    Xem chi tiết
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit?.(session.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit2 size={12} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.(session.id);
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
