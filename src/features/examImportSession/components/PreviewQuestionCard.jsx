import { GripVertical } from 'lucide-react';

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
            <div className="bg-gray-50 px-4 py-3 border-b border-border flex items-center gap-2">
                <GripVertical size={16} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                    Câu {index + 1}
                </span>
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
