import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { MarkdownRenderer } from '../../../shared/components';
import { getDifficultyLabel, getDifficultyColor } from '../../../core/constants/question-constants';

export const StatementItem = ({
    statement,
    index,
    question,
    viewMode,
    onEdit,
    onDelete,
    isDragging = false,
    isDragOver = false,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
}) => {
    const stmtDifficultyColor = statement.difficulty
        ? getDifficultyColor(statement.difficulty)
        : null;

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            className={`
                p-3 rounded border-l-4 transition-all cursor-move
                ${statement.isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-gray-50 border-gray-300'
                }
                ${isDragging ? 'opacity-50 scale-95' : ''}
                ${isDragOver ? 'border-t-4 border-t-blue-500' : ''}
            `}
        >
            <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div className="flex items-center shrink-0 cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} className="text-gray-400 hover:text-gray-600" />
                </div>

                <span className="w-6 text-sm font-semibold text-gray-700 shrink-0">
                    {String.fromCharCode(65 + index)}.
                </span>

                <div className="flex-1 space-y-1">
                    {viewMode === 'preview' ? (
                        <div className="prose prose-sm max-w-none">
                            <MarkdownRenderer
                                content={
                                    statement.processedContent ||
                                    statement.content
                                }
                            />
                        </div>
                    ) : (
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                            {statement.content}
                        </pre>
                    )}

                    {stmtDifficultyColor && (
                        <span
                            className={`inline-block text-xs px-2 py-0.5 rounded ${stmtDifficultyColor.bg} ${stmtDifficultyColor.text}`}
                        >
                            {getDifficultyLabel(statement.difficulty)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {statement.isCorrect && (
                        <span
                            className="text-green-600 font-bold text-lg"
                            title="Đáp án đúng"
                        >
                            ✓
                        </span>
                    )}

                    {onEdit && (
                        <button
                            onClick={() => onEdit(statement, question)}
                            className="
                                p-1.5 rounded border border-gray-300
                                text-gray-700 hover:bg-gray-100
                                transition
                            "
                            title="Chỉnh sửa đáp án"
                        >
                            <Edit2 size={14} />
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={() => onDelete(statement, question)}
                            className="
                                p-1.5 rounded border border-red-300
                                text-red-600 hover:bg-red-50
                                transition
                            "
                            title="Xóa đáp án"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
