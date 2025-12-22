import React from 'react';
import { Card } from '@/shared/components/ui';
import { FileText, Play, ClipboardList, File, Eye, Edit2, Trash2 } from 'lucide-react';

export type LessonItemType = 'video' | 'online-exercise' | 'assignment' | 'document';

export interface LessonItem {
    id: string;
    title: string;
    type: LessonItemType;
    content: string; // URL for video/document, description for exercises
    order: number;
    // For assignments
    submissionCount?: number;
    totalStudents?: number;
    // For online exercises
    examId?: string;
    examTitle?: string;
    completedCount?: number;
}

interface LessonItemCardProps {
    item: LessonItem;
    onEdit?: (item: LessonItem) => void;
    onDelete?: (id: string) => void;
    onViewSubmissions?: (item: LessonItem) => void;
    onViewRank?: (item: LessonItem) => void;
}

const getItemTypeIcon = (type: LessonItemType) => {
    switch (type) {
        case 'video':
            return <Play size={14} className="text-red-600" />;
        case 'online-exercise':
            return <ClipboardList size={14} className="text-blue-600" />;
        case 'assignment':
            return <FileText size={14} className="text-orange-600" />;
        case 'document':
            return <File size={14} className="text-green-600" />;
    }
};

const getItemTypeText = (type: LessonItemType) => {
    switch (type) {
        case 'video':
            return 'Video';
        case 'online-exercise':
            return 'Bài tập online';
        case 'assignment':
            return 'Bài tập nộp file';
        case 'document':
            return 'Tài liệu';
    }
};

const getItemTypeBgColor = (type: LessonItemType) => {
    switch (type) {
        case 'video':
            return 'bg-red-50';
        case 'online-exercise':
            return 'bg-blue-50';
        case 'assignment':
            return 'bg-orange-50';
        case 'document':
            return 'bg-green-50';
    }
};

export const LessonItemCard: React.FC<LessonItemCardProps> = ({
    item,
    onEdit,
    onDelete,
    onViewSubmissions,
    onViewRank,
}) => {
    return (
        <div className={`p-3 ${getItemTypeBgColor(item.type)} rounded-lg border border-gray-200`}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="mt-0.5">{getItemTypeIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-900">{item.title}</span>
                            <span className="px-1.5 py-0.5 bg-white text-[10px] font-medium text-gray-600 rounded">
                                {getItemTypeText(item.type)}
                            </span>
                        </div>
                        {item.type === 'online-exercise' && item.examId ? (
                            <>
                                <p className="text-[10px] text-gray-600 mb-1">
                                    Kỳ thi: <span className="font-medium">{item.examTitle}</span>
                                </p>
                                <p className="text-[10px] text-gray-500">ID: {item.examId}</p>
                            </>
                        ) : (
                            <p className="text-[10px] text-gray-600 break-all">{item.content}</p>
                        )}
                        {item.type === 'assignment' && (
                            <div className="mt-2 flex items-center gap-2">
                                <button
                                    onClick={() => onViewSubmissions?.(item)}
                                    className="flex items-center gap-1 px-2 py-1 text-[10px] text-blue-600 bg-white hover:bg-blue-50 rounded transition-colors"
                                >
                                    <Eye size={12} />
                                    Xem bài nộp ({item.submissionCount}/{item.totalStudents})
                                </button>
                            </div>
                        )}
                        {item.type === 'online-exercise' && item.examId && (
                            <div className="mt-2 flex items-center gap-2">
                                <button
                                    onClick={() => onViewRank?.(item)}
                                    className="flex items-center gap-1 px-2 py-1 text-[10px] text-blue-600 bg-white hover:bg-blue-50 rounded transition-colors"
                                >
                                    <Eye size={12} />
                                    Xem rank ({item.completedCount}/{item.totalStudents})
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit?.(item)}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={() => onDelete?.(item.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-white rounded transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};
