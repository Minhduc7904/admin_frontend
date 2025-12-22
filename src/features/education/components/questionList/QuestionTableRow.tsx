import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, MoreVertical, Eye, ChevronDown, ChevronUp } from 'lucide-react';

export type QuestionType = 'SINGLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
export type Difficulty = 'TH' | 'NB' | 'VD' | 'VDC';

export interface Statement {
    id: string;
    content: string;
    isCorrect: boolean;
    order: number;
    difficulty?: Difficulty;
}

export interface Question {
    id: string;
    content: string;
    type: QuestionType;
    difficulty: Difficulty;
    chapter: string;
    grade: number;
    correctAnswer?: string; // for SHORT_ANSWER
    statements?: Statement[]; // for SINGLE_CHOICE and TRUE_FALSE
    createdAt: string;
}

interface QuestionTableRowProps {
    question: Question;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const getTypeText = (type: QuestionType) => {
    switch (type) {
        case 'SINGLE_CHOICE':
            return 'Trắc nghiệm';
        case 'TRUE_FALSE':
            return 'Đúng/Sai';
        case 'SHORT_ANSWER':
            return 'Trả lời ngắn';
        default:
            return type;
    }
};

const getTypeColor = (type: QuestionType) => {
    switch (type) {
        case 'SINGLE_CHOICE':
            return 'bg-blue-100 text-blue-700';
        case 'TRUE_FALSE':
            return 'bg-purple-100 text-purple-700';
        case 'SHORT_ANSWER':
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getDifficultyText = (difficulty: Difficulty) => {
    switch (difficulty) {
        case 'TH':
            return 'Thông hiểu';
        case 'NB':
            return 'Nhận biết';
        case 'VD':
            return 'Vận dụng';
        case 'VDC':
            return 'VD Cao';
        default:
            return difficulty;
    }
};

const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
        case 'TH':
            return 'bg-cyan-100 text-cyan-700';
        case 'NB':
            return 'bg-green-100 text-green-700';
        case 'VD':
            return 'bg-orange-100 text-orange-700';
        case 'VDC':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export const QuestionTableRow: React.FC<QuestionTableRowProps> = ({
    question,
    onView,
    onEdit,
    onDelete,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
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

    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-0.5 text-gray-400 hover:text-gray-600"
                        >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 leading-snug">
                                {isExpanded ? question.content : truncateContent(question.content)}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(question.type)}`}>
                                    {getTypeText(question.type)}
                                </span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                                    {getDifficultyText(question.difficulty)}
                                </span>
                                <span className="text-xs text-gray-500">Khối {question.grade}</span>
                                {question.statements && question.statements.length > 0 && (
                                    <span className="text-xs text-gray-500">
                                        • {question.statements.length} mệnh đề
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="py-3 px-4">
                    <span className="text-xs text-gray-900">{question.chapter}</span>
                </td>
                <td className="py-3 px-4">
                    <span className="text-xs text-gray-500">{question.createdAt}</span>
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
                                            onView?.(question.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Eye size={12} />
                                        Xem chi tiết
                                    </button>
                                    <button
                                        onClick={() => {
                                            onEdit?.(question.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit2 size={12} />
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete?.(question.id);
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
            {isExpanded && question.statements && question.statements.length > 0 && (
                <tr className="bg-gray-50">
                    <td colSpan={4} className="py-3 px-4 pl-12">
                        <div className="text-xs">
                            <p className="font-semibold text-gray-700 mb-2">Mệnh đề:</p>
                            <div className="space-y-1.5">
                                {question.statements.map((statement, index) => (
                                    <div key={statement.id} className="flex items-start gap-2">
                                        <span className="font-medium text-gray-600 min-w-[20px]">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-gray-900">{statement.content}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-1.5 py-0.5 text-xs rounded ${
                                                    statement.isCorrect 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {statement.isCorrect ? 'Đúng' : 'Sai'}
                                                </span>
                                                {statement.difficulty && (
                                                    <span className={`px-1.5 py-0.5 text-xs rounded ${getDifficultyColor(statement.difficulty)}`}>
                                                        {getDifficultyText(statement.difficulty)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
            {isExpanded && question.type === 'SHORT_ANSWER' && question.correctAnswer && (
                <tr className="bg-gray-50">
                    <td colSpan={4} className="py-3 px-4 pl-12">
                        <div className="text-xs">
                            <p className="font-semibold text-gray-700 mb-1">Đáp án đúng:</p>
                            <p className="text-gray-900 bg-green-50 px-2 py-1 rounded inline-block">
                                {question.correctAnswer}
                            </p>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
