import { CheckCircle, XCircle } from 'lucide-react';

const QUESTION_TYPE_LABELS = {
    SINGLE_CHOICE: 'Một đáp án',
    MULTIPLE_CHOICE: 'Nhiều đáp án',
    TRUE_FALSE: 'Đúng/Sai',
    SHORT_ANSWER: 'Trả lời ngắn',
    ESSAY: 'Tự luận',
};

const DIFFICULTY_LABELS = {
    TH: 'Thông hiểu',
    NB: 'Nhận biết',
    VD: 'Vận dụng',
    VDC: 'Vận dụng cao',
};

const DIFFICULTY_COLORS = {
    TH: 'bg-blue-100 text-blue-700',
    NB: 'bg-green-100 text-green-700',
    VD: 'bg-orange-100 text-orange-700',
    VDC: 'bg-red-100 text-red-700',
};

export const ExamQuestionCard = ({ question, index }) => {

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                                {QUESTION_TYPE_LABELS[question.type] || question.type}
                            </span>
                            {question.difficulty && (
                                <span className={`px-2 py-1 text-xs font-medium rounded ${DIFFICULTY_COLORS[question.difficulty]}`}>
                                    {DIFFICULTY_LABELS[question.difficulty]}
                                </span>
                            )}
                            {question.pointsOrigin && (
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                                    {question.pointsOrigin} điểm
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="text-sm text-gray-900 mb-4 whitespace-pre-wrap">
                {question.processedContent || question.content}
            </div>

            {/* Statements */}
            {question.statements && question.statements.length > 0 && (
                <div className="space-y-2 mb-4 ml-4">
                    {question.statements.map((statement, idx) => (
                        <div
                            key={statement.statementId}
                            className={`flex items-start gap-2 p-2 rounded ${
                                statement.isCorrect
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-gray-50'
                            }`}
                        >
                            {statement.isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 text-sm text-gray-900 whitespace-pre-wrap">
                                {statement.processedContent || statement.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Correct Answer */}
            {question.correctAnswer && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="font-medium text-green-900 text-sm mb-1">Đáp án đúng:</div>
                    <div className="text-green-800 text-sm">{question.correctAnswer}</div>
                </div>
            )}

            {/* Solution */}
            {(question.processedSolution || question.solution) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="font-medium text-blue-900 text-sm mb-2">Lời giải:</div>
                    <div className="text-sm text-blue-900 whitespace-pre-wrap">
                        {question.processedSolution || question.solution}
                    </div>
                </div>
            )}

            {/* Solution YouTube URL */}
            {question.solutionYoutubeUrl && (
                <div className="mt-3">
                    <a
                        href={question.solutionYoutubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        🎥 Xem video lời giải
                    </a>
                </div>
            )}
        </div>
    );
};
