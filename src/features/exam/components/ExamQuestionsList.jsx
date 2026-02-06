import { useState, useRef, useEffect } from 'react';
import { FileQuestion } from 'lucide-react';
import { ExamQuestionCard } from './ExamQuestionCard';
import { InlineLoading } from '../../../shared/components';

export const ExamQuestionsList = ({ 
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
    dragSource = null,
    isAllQuestions = false,
    onReorderQuestions,
    height = 'h-full',
    onEditQuestion,
    onRemoveQuestion,
}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const scrollContainerRef = useRef(null);
    const autoScrollIntervalRef = useRef(null);

    // Auto-scroll when dragging near edges
    useEffect(() => {
        return () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
        };
    }, []);

    const handleAutoScroll = (e) => {
        if (!scrollContainerRef.current || dragSource !== 'section') return;

        const container = scrollContainerRef.current;
        const rect = container.getBoundingClientRect();
        const scrollThreshold = 80; // pixels from edge to trigger scroll
        const scrollSpeed = 10;

        const distanceFromTop = e.clientY - rect.top;
        const distanceFromBottom = rect.bottom - e.clientY;

        // Clear existing interval
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }

        // Scroll up
        if (distanceFromTop < scrollThreshold && distanceFromTop > 0) {
            autoScrollIntervalRef.current = setInterval(() => {
                container.scrollTop -= scrollSpeed;
            }, 16);
        }
        // Scroll down
        else if (distanceFromBottom < scrollThreshold && distanceFromBottom > 0) {
            autoScrollIntervalRef.current = setInterval(() => {
                container.scrollTop += scrollSpeed;
            }, 16);
        }
    };

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
            handleAutoScroll(e);
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
        const items = {
            examId: reorderedQuestions[0]?.examId,
            items: reorderedQuestions.map((q, index) => ({
                questionId: q.questionId,
                order: index + 1,
            }))
        };

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
        
        // Clear auto-scroll interval
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }
        
        if (onQuestionDragEnd) {
            onQuestionDragEnd();
        }
    };
    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-8 flex justify-center">
                <InlineLoading message="Đang tải câu hỏi..." />
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        const showDropZone = isDragOver && !isUncategorized && dragSource !== 'section';
        return (
            <div 
                className={`
                    bg-white rounded-lg border-2 border-dashed p-8 text-center transition-colors
                    ${showDropZone ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                `}
                onDragOver={!isUncategorized ? onDragOver : undefined}
                onDragLeave={!isUncategorized ? onDragLeave : undefined}
                onDrop={!isUncategorized ? onDrop : undefined}
            >
                <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <FileQuestion size={32} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                        {showDropZone ? 'Thả câu hỏi vào đây' : 'Chưa có câu hỏi'}
                    </p>
                    <p className="text-sm text-gray-500">
                        {sectionTitle 
                            ? `Chưa có câu hỏi nào trong phần "${sectionTitle}"`
                            : 'Chưa có câu hỏi nào'
                        }
                    </p>
                </div>
            </div>
        );
    }

    const showDropZone = isDragOver && !isUncategorized && dragSource !== 'section';

    return (
        <div 
            className={`
                space-y-4 flex-1
                ${!isAllQuestions ? 'rounded-lg border-2 border-dashed p-4 transition-colors' : ''}
                ${!isAllQuestions && showDropZone ? 'border-blue-500 bg-blue-50' : !isAllQuestions ? 'border-transparent' : ''}
            `}
            onDragOver={!isUncategorized && !isAllQuestions ? onDragOver : undefined}
            onDragLeave={!isUncategorized && !isAllQuestions ? onDragLeave : undefined}
            onDrop={!isUncategorized && !isAllQuestions ? onDrop : undefined}
        >
            <div className="text-sm text-gray-600 mb-4">
                Tổng số: <span className="font-semibold text-gray-900">{questions.length}</span> câu hỏi
            </div>
            <div 
                ref={scrollContainerRef}
                className={`flex flex-col gap-2 flex-1 ${height} overflow-y-auto overflow-x-hidden`}
            >
                {questions.map((question, index) => (
                    <ExamQuestionCard
                        key={question.questionId}
                        question={question}
                        index={index}
                        isDragging={draggedQuestionId === question.questionId || draggedIndex === index}
                        isDragOver={!isUncategorized && !isAllQuestions && dragOverIndex === index && dragSource === 'section' && draggedIndex !== index}
                        onDragStart={
                            (!isUncategorized && !isAllQuestions)
                                ? () => handleReorderDragStart(index, question)
                                : isAllQuestions
                                ? () => onQuestionDragStart?.(question, 'allQuestions')
                                : undefined
                        }
                        onDragEnd={
                            (!isUncategorized && !isAllQuestions)
                                ? handleReorderDragEnd
                                : isAllQuestions
                                ? onQuestionDragEnd
                                : undefined
                        }
                        onDragOver={!isUncategorized && !isAllQuestions && dragSource === 'section' ? (e) => handleReorderDragOver(e, index) : undefined}
                        onDragLeave={!isUncategorized && !isAllQuestions && dragSource === 'section' ? handleReorderDragLeave : undefined}
                        onDrop={!isUncategorized && !isAllQuestions && dragSource === 'section' ? (e) => handleReorderDrop(e, index) : undefined}
                        onEdit={onEditQuestion}
                        onRemove={onRemoveQuestion}
                    />
                ))}
            </div>
        </div>
    );
};
