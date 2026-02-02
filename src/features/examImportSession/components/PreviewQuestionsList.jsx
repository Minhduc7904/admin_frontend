import { Loader2, CheckCircle } from 'lucide-react';
import { PreviewQuestionCard } from './PreviewQuestionCard';

export const PreviewQuestionsList = ({ 
    loading, 
    questions,
    draggedQuestionId,
    onDragStart,
    onDragEnd,
    isDragOver = false,
    onDragOver,
    onDragLeave,
    onDrop,
}) => {
    const hasQuestions = questions && questions.length > 0;

    return (
        <div className="bg-white rounded-lg border border-border h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Danh sách câu hỏi
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {hasQuestions
                                ? `Tổng cộng ${questions.length} câu hỏi`
                                : 'Chưa có câu hỏi nào'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div 
                className={`flex-1 p-6 overflow-hidden transition-colors ${
                    isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-500' : ''
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                        <Loader2
                            size={36}
                            className="animate-spin text-gray-400 mb-3"
                        />
                        <p className="text-sm text-gray-500">
                            Đang tải câu hỏi, vui lòng đợi…
                        </p>
                    </div>
                ) : hasQuestions ? (
                    <div className="space-y-4 h-full overflow-y-auto">
                        {questions.map((question, index) => (
                            <PreviewQuestionCard
                                key={question.tempQuestionId ?? index}
                                question={question}
                                index={index}
                                isDragging={draggedQuestionId === question.tempQuestionId}
                                onDragStart={() => onDragStart(question)}
                                onDragEnd={onDragEnd}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle
                                size={28}
                                className="text-gray-400"
                            />
                        </div>

                        <p className="text-sm font-medium text-gray-700 mb-1">
                            Chưa có câu hỏi
                        </p>
                        <p className="text-xs text-gray-500 max-w-xs">
                            Vui lòng quay lại bước xử lý câu hỏi để tạo câu hỏi
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
