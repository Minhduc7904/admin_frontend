import { ExamQuestionCard } from './ExamQuestionCard';

export const ExamQuestionsList = ({ questions, loading, sectionTitle }) => {
    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải câu hỏi...</p>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                    {sectionTitle 
                        ? `Chưa có câu hỏi nào trong phần "${sectionTitle}"`
                        : 'Chưa có câu hỏi nào'
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 ">
            <div className="text-sm text-gray-600 mb-4">
                Tổng số: <span className="font-semibold text-gray-900">{questions.length}</span> câu hỏi
            </div>
            {questions.map((question, index) => (
                <ExamQuestionCard
                    key={question.questionId}
                    question={question}
                    index={index}
                />
            ))}
        </div>
    );
};
