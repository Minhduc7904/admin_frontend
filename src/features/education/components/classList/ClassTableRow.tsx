import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, MoreVertical, Users } from 'lucide-react';

export interface Class {
    id: string;
    name: string;
    classCode: string;
    grade: string;
    subject: string;
    teacher: string;
    studentCount: number;
    status: 'active' | 'completed' | 'archived';
    academicYear: string;
}

interface ClassTableRowProps {
    classItem: Class;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const getStatusColor = (status: Class['status']) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'completed':
            return 'bg-blue-100 text-blue-700';
        case 'archived':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: Class['status']) => {
    switch (status) {
        case 'active':
            return 'Đang hoạt động';
        case 'completed':
            return 'Đã hoàn thành';
        case 'archived':
            return 'Lưu trữ';
        default:
            return status;
    }
};

export const ClassTableRow: React.FC<ClassTableRowProps> = ({
    classItem,
    onEdit,
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
                    <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                        <Users size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{classItem.name}</span>
                </div>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{classItem.classCode}</span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-900">{classItem.grade}</span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-900">{classItem.subject}</span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-900">{classItem.teacher}</span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs font-medium text-gray-900">{classItem.studentCount}</span>
            </td>
            <td className="py-2 px-3">
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getStatusColor(classItem.status)}`}>
                    {getStatusText(classItem.status)}
                </span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{classItem.academicYear}</span>
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
                                        navigate(`/education/classes/${classItem.id}`);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Eye size={12} />
                                    Xem chi tiết
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit?.(classItem.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit2 size={12} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.(classItem.id);
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
