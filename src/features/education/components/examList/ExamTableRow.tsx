import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, MoreVertical, Eye } from 'lucide-react';

export interface Exam {
    id: string;
    title: string;
    examCode: string;
    chapter: string;
    grade: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    status: 'published' | 'draft' | 'archived';
    createdDate: string;
}

interface ExamTableRowProps {
    exam: Exam;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const getStatusColor = (status: Exam['status']) => {
    switch (status) {
        case 'published':
            return 'bg-green-100 text-green-700';
        case 'draft':
            return 'bg-orange-100 text-orange-700';
        case 'archived':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: Exam['status']) => {
    switch (status) {
        case 'published':
            return 'Đã xuất bản';
        case 'draft':
            return 'Bản nháp';
        case 'archived':
            return 'Đã lưu trữ';
        default:
            return status;
    }
};

const getDifficultyColor = (difficulty: Exam['difficulty']) => {
    switch (difficulty) {
        case 'easy':
            return 'bg-blue-100 text-blue-700';
        case 'medium':
            return 'bg-yellow-100 text-yellow-700';
        case 'hard':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getDifficultyText = (difficulty: Exam['difficulty']) => {
    switch (difficulty) {
        case 'easy':
            return 'Dễ';
        case 'medium':
            return 'Trung bình';
        case 'hard':
            return 'Khó';
        default:
            return difficulty;
    }
};

export const ExamTableRow: React.FC<ExamTableRowProps> = ({
    exam,
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
                    <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                    <div className="text-xs text-gray-500">{exam.examCode}</div>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-gray-900">{exam.chapter}</span>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-gray-900">{exam.grade}</span>
            </td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(exam.difficulty)}`}>
                    {getDifficultyText(exam.difficulty)}
                </span>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-gray-900">{exam.questionCount} câu</span>
            </td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exam.status)}`}>
                    {getStatusText(exam.status)}
                </span>
            </td>
            <td className="py-3 px-4">
                <span className="text-xs text-gray-600">{exam.createdDate}</span>
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
                                        onView?.(exam.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Eye size={12} />
                                    Xem chi tiết
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit?.(exam.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit2 size={12} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.(exam.id);
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
