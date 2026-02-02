import { useState } from 'react';
import { Plus } from 'lucide-react';
import { StatementItem } from './StatementItem';
import { QuestionType } from '../../../core/constants/question-constants';

export const StatementList = ({
    statements = [],
    question,
    viewMode,
    onEditStatement,
    onDeleteStatement,
    onCreateStatement,
    onReorderStatements,
}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const hasStatements = statements && statements.length > 0;
    const canAddStatement =
        onCreateStatement &&
        (question.type === QuestionType.SINGLE_CHOICE ||
            question.type === QuestionType.MULTIPLE_CHOICE);

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        // Reorder locally
        const reorderedStatements = [...statements];
        const [draggedItem] = reorderedStatements.splice(draggedIndex, 1);
        reorderedStatements.splice(dropIndex, 0, draggedItem);

        // Build items array with new orders
        const items = reorderedStatements.map((stmt, index) => ({
            id: stmt.tempStatementId,
            order: index + 1,
        }));

        // Call reorder handler with items and questionId
        if (onReorderStatements) {
            onReorderStatements(items, question.tempQuestionId);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="space-y-2">
            {hasStatements && (
                <>
                    {statements.map((stmt, idx) => (
                        <StatementItem
                            key={stmt.tempStatementId ?? `${question.order}-${idx}`}
                            statement={stmt}
                            index={idx}
                            question={question}
                            viewMode={viewMode}
                            onEdit={onEditStatement}
                            onDelete={onDeleteStatement}
                            isDragging={draggedIndex === idx}
                            isDragOver={dragOverIndex === idx}
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, idx)}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                </>
            )}

            {canAddStatement && (
                <button
                    onClick={() => onCreateStatement(question)}
                    className="
                        w-full mt-2 px-3 py-2
                        border-2 border-dashed border-gray-300
                        rounded text-sm text-gray-600
                        hover:bg-gray-50 hover:border-gray-400
                        transition flex items-center justify-center gap-2
                    "
                    title="Thêm đáp án mới"
                >
                    <Plus size={16} />
                    Thêm đáp án
                </button>
            )}
        </div>
    );
};
