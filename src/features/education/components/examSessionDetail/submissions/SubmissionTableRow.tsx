import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, MoreVertical, Eye } from 'lucide-react';

export interface Submission {
    id: string;
    studentName: string;
    studentCode: string;
    studentClass: string;
    startTime?: string;
    submitTime?: string;
    score?: number;
    totalScore: number;
    status: 'completed' | 'in-progress' | 'not-started';
    attemptNumber: number;
}

interface SubmissionTableRowProps {
    submission: Submission;
    onView?: (id: string) => void;
    onGrade?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const getStatusColor = (status: Submission['status']) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-700';
        case 'in-progress':
            return 'bg-orange-100 text-orange-700';
        case 'not-started':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: Submission['status']) => {
    switch (status) {
        case 'completed':
            return 'Đã hoàn thành';
        case 'in-progress':
            return 'Đang làm';
        case 'not-started':
            return 'Chưa làm';
        default:
            return status;
    }
};

const getScoreColor = (score: number, totalScore: number) => {
    const percentage = (score / totalScore) * 100;
    if (percentage >= 80) return 'text-green-600 font-semibold';
    if (percentage >= 50) return 'text-orange-600 font-semibold';
    return 'text-red-600 font-semibold';
};

export const SubmissionTableRow: React.FC<SubmissionTableRowProps> = ({
    submission,
    onView,
    onGrade,
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
                    <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                    <div className="text-xs text-gray-500">
                        {submission.studentCode} • {submission.studentClass}
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="text-xs text-gray-900">Lần {submission.attemptNumber}</span>
            </td>
            <td className="py-3 px-4">
                {submission.startTime ? (
                    <span className="text-xs text-gray-900">{submission.startTime}</span>
                ) : (
                    <span className="text-xs text-gray-400">--</span>
                )}
            </td>
            <td className="py-3 px-4">
                {submission.submitTime ? (
                    <span className="text-xs text-gray-900">{submission.submitTime}</span>
                ) : (
                    <span className="text-xs text-gray-400">--</span>
                )}
            </td>
            <td className="py-3 px-4">
                {submission.score !== undefined ? (
                    <span className={`text-sm ${getScoreColor(submission.score, submission.totalScore)}`}>
                        {submission.score.toFixed(1)}/{submission.totalScore}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">Chưa chấm</span>
                )}
            </td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                    {getStatusText(submission.status)}
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
                                        onView?.(submission.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Eye size={12} />
                                    Xem chi tiết
                                </button>
                                {submission.status === 'completed' && (
                                    <button
                                        onClick={() => {
                                            onGrade?.(submission.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit2 size={12} />
                                        Chấm điểm
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        onDelete?.(submission.id);
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
