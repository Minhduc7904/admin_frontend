import { Loader2, Sparkles, Plus, Wand2 } from 'lucide-react';
import { QuestionCard } from './QuestionCard';

export const QuestionsList = ({
    loading,
    questions,
    onEditQuestion,
    onEditStatement,
    onCreateQuestion,
    onCreateStatement,
    onDeleteQuestion,
    onDeleteStatement,
    onReorderStatements,
    onClassifyChapters,
    classifyChaptersLoading,
}) => {
    const hasQuestions = questions && questions.length > 0;

    return (
        <div className="bg-white rounded-lg border border-border h-full flex flex-col">
            {/* ================= Header ================= */}
            <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Danh sách câu hỏi
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {hasQuestions
                                ? `Đã có ${questions.length} câu hỏi`
                                : 'Chưa có câu hỏi nào được tách'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {onClassifyChapters && hasQuestions && (
                            <button
                                onClick={onClassifyChapters}
                                disabled={classifyChaptersLoading}
                                className="
                                    flex items-center gap-2
                                    px-3 py-2
                                    text-sm font-medium
                                    rounded border border-purple-300
                                    text-purple-700 bg-purple-50
                                    hover:bg-purple-100
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition
                                "
                                title="Phân loại chương tự động bằng AI"
                            >
                                {classifyChaptersLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Wand2 size={16} />
                                )}
                                Phân loại chương AI
                            </button>
                        )}
                        
                        {onCreateQuestion && (
                            <button
                                onClick={onCreateQuestion}
                                className="
                                    flex items-center gap-2
                                    px-3 py-2
                                    text-sm font-medium
                                    rounded border border-gray-300
                                    text-gray-700
                                    hover:bg-gray-100
                                    transition
                                "
                                title="Thêm câu hỏi mới"
                            >
                                <Plus size={16} />
                                Thêm câu hỏi
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= Content ================= */}
            <div className="flex-1 p-6 overflow-hidden">
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
                            <QuestionCard
                                key={question.tempQuestionId ?? index}
                                question={question}
                                index={index}
                                onEditQuestion={onEditQuestion}
                                onEditStatement={onEditStatement}
                                onCreateStatement={onCreateStatement}
                                onDeleteQuestion={onDeleteQuestion}
                                onDeleteStatement={onDeleteStatement}
                                onReorderStatements={onReorderStatements}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Sparkles
                                size={28}
                                className="text-gray-400"
                            />
                        </div>

                        <p className="text-sm font-medium text-gray-700 mb-1">
                            Chưa có câu hỏi
                        </p>
                        <p className="text-xs text-gray-500 max-w-xs">
                            Sử dụng chức năng tách câu hỏi hoặc thêm câu hỏi
                            thủ công để bắt đầu
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
