import { useState } from 'react';
import { Loader2, FileQuestion } from 'lucide-react';
import { PreviewQuestionCard } from './PreviewQuestionCard';

export const SectionQuestionsList = ({ 
    questions, 
    loading, 
    sectionTitle,
    isDragOver = false,
    onDragOver,
    onDragLeave,
    onDrop,
    draggedQuestionId,
    onQuestionDragStart,
    onQuestionDragEnd,
    isUncategorized = false,
    onReorderQuestions,
    dragSource = null,
}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const handleReorderDragStart = (index, question) => {
        setDraggedIndex(index);
        if (onQuestionDragStart) {
            onQuestionDragStart(question, 'section');
        }
    };

    const handleReorderDragOver = (e, index) => {
        e.preventDefault();
        // Only handle reorder when dragging from section
        if (dragSource === 'section') {
            e.stopPropagation();
            setDragOverIndex(index);
        }
    };

    const handleReorderDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleReorderDrop = (e, dropIndex) => {
        e.preventDefault();
        
        // Only handle reorder when dragging from section
        if (dragSource !== 'section') {
            return;
        }

        e.stopPropagation();
        
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        // Reorder locally
        const reorderedQuestions = [...questions];
        const [draggedItem] = reorderedQuestions.splice(draggedIndex, 1);
        reorderedQuestions.splice(dropIndex, 0, draggedItem);

        // Build items array with new orders
        const items = reorderedQuestions.map((q, index) => ({
            id: q.tempQuestionId,
            order: index + 1,
        }));

        // Call reorder handler
        if (onReorderQuestions) {
            onReorderQuestions(items);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleReorderDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
        if (onQuestionDragEnd) {
            onQuestionDragEnd();
        }
    };
    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-border p-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <Loader2 size={36} className="text-primary animate-spin mb-3" />
                    <p className="text-sm text-gray-500">Đang tải câu hỏi...</p>
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        const showDropZone = isDragOver && !isUncategorized && dragSource !== 'section';
        return (
            <div 
                className={`
                    bg-white rounded-lg border-2 border-dashed p-8 transition-colors
                    ${showDropZone ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                `}
                onDragOver={!isUncategorized ? onDragOver : undefined}
                onDragLeave={!isUncategorized ? onDragLeave : undefined}
                onDrop={!isUncategorized ? onDrop : undefined}
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <FileQuestion size={32} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                        {showDropZone ? 'Thả câu hỏi vào đây' : 'Chưa có câu hỏi'}
                    </p>
                    <p className="text-sm text-gray-500">
                        {sectionTitle ? `Section "${sectionTitle}" chưa có câu hỏi nào` : 'Chưa có câu hỏi chưa phân loại'}
                    </p>
                </div>
            </div>
        );
    }

    const showDropZone = isDragOver && !isUncategorized && dragSource !== 'section';

    return (
        <div 
            className={`
                space-y-4 rounded-lg border-2 border-dashed p-4 transition-colors
                ${showDropZone ? 'border-blue-500 bg-blue-50' : 'border-transparent'}
            `}
            onDragOver={!isUncategorized ? onDragOver : undefined}
            onDragLeave={!isUncategorized ? onDragLeave : undefined}
            onDrop={!isUncategorized ? onDrop : undefined}
        >
            {questions.map((question, idx) => (
                <PreviewQuestionCard 
                    key={question.tempQuestionId} 
                    question={question}
                    index={idx}
                    isDragging={!isUncategorized && (draggedQuestionId === question.tempQuestionId || draggedIndex === idx)}
                    isDragOver={!isUncategorized && dragOverIndex === idx && dragSource === 'section'}
                    onDragStart={!isUncategorized ? () => handleReorderDragStart(idx, question) : undefined}
                    onDragEnd={!isUncategorized ? handleReorderDragEnd : undefined}
                    onDragOver={!isUncategorized && dragSource === 'section' ? (e) => handleReorderDragOver(e, idx) : undefined}
                    onDragLeave={!isUncategorized && dragSource === 'section' ? handleReorderDragLeave : undefined}
                    onDrop={!isUncategorized && dragSource === 'section' ? (e) => handleReorderDrop(e, idx) : undefined}
                />
            ))}
        </div>
    );
};
