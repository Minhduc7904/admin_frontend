import React from 'react';
import { Card } from '@/shared/components/ui';
import { BookOpen, Calendar, Clock, Edit2, Trash2, Plus } from 'lucide-react';
import { LessonItemCard, type LessonItem } from './LessonItemCard';

export interface Lesson {
    id: string;
    title: string;
    description: string;
    date: string;
    duration: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    items: LessonItem[];
}

interface LessonCardProps {
    lesson: Lesson;
    onEdit?: (lesson: Lesson) => void;
    onDelete?: (id: string) => void;
    onAddItem?: (lessonId: string) => void;
    onEditItem?: (item: LessonItem) => void;
    onDeleteItem?: (itemId: string) => void;
    onViewSubmissions?: (item: LessonItem) => void;
    onViewRank?: (item: LessonItem) => void;
}

const getStatusColor = (status: Lesson['status']) => {
    switch (status) {
        case 'upcoming':
            return 'bg-blue-100 text-blue-700';
        case 'completed':
            return 'bg-green-100 text-green-700';
        case 'cancelled':
            return 'bg-red-100 text-red-700';
    }
};

const getStatusText = (status: Lesson['status']) => {
    switch (status) {
        case 'upcoming':
            return 'Sắp diễn ra';
        case 'completed':
            return 'Đã hoàn thành';
        case 'cancelled':
            return 'Đã hủy';
    }
};

export const LessonCard: React.FC<LessonCardProps> = ({
    lesson,
    onEdit,
    onDelete,
    onAddItem,
    onEditItem,
    onDeleteItem,
    onViewSubmissions,
    onViewRank,
}) => {
    return (
        <Card>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2 flex-1">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BookOpen size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{lesson.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{lesson.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                {lesson.date}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {lesson.duration}
                            </div>
                            <span className={`px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(lesson.status)}`}>
                                {getStatusText(lesson.status)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit?.(lesson)}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Chỉnh sửa buổi học"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete?.(lesson.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Xóa buổi học"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h5 className="text-xs font-semibold text-gray-700">Mục học tập ({lesson.items.length})</h5>
                    <button
                        onClick={() => onAddItem?.(lesson.id)}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                        <Plus size={12} />
                        Thêm mục
                    </button>
                </div>

                {lesson.items.length > 0 ? (
                    <div className="space-y-2">
                        {lesson.items.map((item) => (
                            <LessonItemCard
                                key={item.id}
                                item={item}
                                onEdit={onEditItem}
                                onDelete={onDeleteItem}
                                onViewSubmissions={onViewSubmissions}
                                onViewRank={onViewRank}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-xs text-gray-500">
                        Chưa có mục học tập nào
                    </div>
                )}
            </div>
        </Card>
    );
};
