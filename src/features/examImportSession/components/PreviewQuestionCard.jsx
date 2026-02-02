import { GripVertical } from 'lucide-react';
import {
    getQuestionTypeLabel,
    getQuestionTypeColor,
    getDifficultyLabel,
    getDifficultyColor,
} from '../../../core/constants/question-constants';

export const PreviewQuestionCard = ({ 
    question,
    index,
    isDragging = false,
    isDragOver = false,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
}) => {
    const typeColor = getQuestionTypeColor(question.type);
    const difficultyColor = question.difficulty
        ? getDifficultyColor(question.difficulty)
        : null;

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
                border border-border rounded-lg overflow-hidden transition cursor-move
                hover:border-gray-400 hover:shadow-sm
                ${isDragging ? 'opacity-50 scale-95' : ''}
                ${isDragOver ? 'border-t-4 border-t-blue-500' : ''}
            `}
        >
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <GripVertical size={16} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">
                            Câu {question.order}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span
                            className={`text-xs px-2 py-1 rounded ${typeColor.bg} ${typeColor.text}`}
                        >
                            {getQuestionTypeLabel(question.type)}
                        </span>

                        {question.difficulty && difficultyColor && (
                            <span
                                className={`text-xs px-2 py-1 rounded ${difficultyColor.bg} ${difficultyColor.text}`}
                            >
                                {getDifficultyLabel(question.difficulty)}
                            </span>
                        )}

                        {question.grade && (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                Khối {question.grade}
                            </span>
                        )}

                        {question.pointsOrigin && (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                {question.pointsOrigin} điểm
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {question.content}
                </p>
            </div>
        </div>
    );
};

export default PreviewQuestionCard;
