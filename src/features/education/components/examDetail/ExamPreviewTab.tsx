import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

interface Statement {
    id: string;
    content: string;
    isCorrect: boolean;
    order: number;
    difficulty: string;
}

interface Question {
    id: string;
    content: string;
    type: 'SINGLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
    difficulty: string;
    chapter: string;
    grade: number;
    statements?: Statement[];
    correctAnswer?: string;
}

interface ExamPreviewTabProps {
    examId: string;
}

const QuestionPreviewItem: React.FC<{ question: Question; index: number }> = ({ question, index }) => {
    const getDifficultyBadge = (difficulty: string) => {
        const colors: Record<string, string> = {
            NB: 'bg-green-100 text-green-700',
            TH: 'bg-cyan-100 text-cyan-700',
            VD: 'bg-orange-100 text-orange-700',
            VDC: 'bg-red-100 text-red-700',
        };
        return colors[difficulty] || 'bg-gray-100 text-gray-700';
    };

    const getStatementLabel = (order: number, type: string) => {
        if (type === 'TRUE_FALSE') {
            return String.fromCharCode(97 + order - 1); // a, b, c, d
        }
        return String.fromCharCode(65 + order - 1); // A, B, C, D
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Question Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center">
                        {index + 1}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyBadge(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{question.chapter}</span>
                    </div>
                    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                        {question.content}
                    </p>
                </div>
            </div>

            {/* Question Type: SINGLE_CHOICE - Multiple Choice */}
            {question.type === 'SINGLE_CHOICE' && question.statements && (
                <div className="ml-14 space-y-3">
                    {question.statements
                        .sort((a, b) => a.order - b.order)
                        .map((statement) => (
                            <div
                                key={statement.id}
                                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    <span className="font-semibold text-sm text-gray-700">
                                        {getStatementLabel(statement.order, question.type)}
                                    </span>
                                </div>
                                <p className="flex-1 text-gray-700 pt-1">
                                    {statement.content}
                                </p>
                            </div>
                        ))}
                </div>
            )}

            {/* Question Type: TRUE_FALSE - Statement Verification */}
            {question.type === 'TRUE_FALSE' && question.statements && (
                <div className="ml-14">
                    <p className="text-sm text-gray-600 mb-3 italic">
                        Xét tính đúng sai của các mệnh đề sau:
                    </p>
                    <div className="space-y-4">
                        {question.statements
                            .sort((a, b) => a.order - b.order)
                            .map((statement) => (
                                <div key={statement.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="flex-shrink-0 font-semibold text-blue-600">
                                            {getStatementLabel(statement.order, question.type)})
                                        </span>
                                        <p className="flex-1 text-gray-700">
                                            {statement.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`statement-${statement.id}`}
                                                className="w-4 h-4 text-green-600"
                                            />
                                            <span className="text-sm text-gray-700">Đúng</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`statement-${statement.id}`}
                                                className="w-4 h-4 text-red-600"
                                            />
                                            <span className="text-sm text-gray-700">Sai</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Question Type: SHORT_ANSWER */}
            {question.type === 'SHORT_ANSWER' && (
                <div className="ml-14">
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Câu trả lời:
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập câu trả lời..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export const ExamPreviewTab: React.FC<ExamPreviewTabProps> = ({ examId }) => {
    // Mock data - same questions from ExamQuestionsTab
    const questions: Question[] = [
        {
            id: '1',
            content: 'Cho hàm số y = f(x) có đạo hàm trên R và có đồ thị như hình vẽ. Hỏi hàm số y = f(x) nghịch biến trên khoảng nào?',
            type: 'SINGLE_CHOICE',
            difficulty: 'TH',
            chapter: 'Chương 1',
            grade: 12,
            statements: [
                { id: 's1', content: '(-∞; 0)', isCorrect: false, order: 1, difficulty: 'TH' },
                { id: 's2', content: '(0; 2)', isCorrect: true, order: 2, difficulty: 'TH' },
                { id: 's3', content: '(2; +∞)', isCorrect: false, order: 3, difficulty: 'TH' },
                { id: 's4', content: '(-∞; 2)', isCorrect: false, order: 4, difficulty: 'TH' },
            ],
        },
        {
            id: '2',
            content: 'Cho hàm số f(x) = x³ - 3x² + 2. Xét tính đúng sai của các mệnh đề sau:',
            type: 'TRUE_FALSE',
            difficulty: 'VD',
            chapter: 'Chương 2',
            grade: 12,
            statements: [
                { id: 's5', content: 'Hàm số đồng biến trên khoảng (2; +∞)', isCorrect: true, order: 1, difficulty: 'NB' },
                { id: 's6', content: 'Hàm số có hai điểm cực trị', isCorrect: true, order: 2, difficulty: 'TH' },
                { id: 's7', content: 'Giá trị nhỏ nhất của hàm số trên [0; 3] là -2', isCorrect: false, order: 3, difficulty: 'VD' },
                { id: 's8', content: 'Đồ thị hàm số cắt trục hoành tại ba điểm phân biệt', isCorrect: false, order: 4, difficulty: 'VDC' },
            ],
        },
        {
            id: '3',
            content: 'Tính đạo hàm của hàm số y = (2x + 1)/(x - 3)',
            type: 'SHORT_ANSWER',
            difficulty: 'NB',
            chapter: 'Chương 2',
            grade: 11,
            correctAnswer: 'y\' = -7/(x-3)²',
        },
        {
            id: '4',
            content: 'Cho hàm số y = ax³ + bx² + cx + d (a ≠ 0) có đồ thị như hình vẽ. Tìm mối quan hệ giữa các hệ số a, b, c, d.',
            type: 'SINGLE_CHOICE',
            difficulty: 'VDC',
            chapter: 'Chương 1',
            grade: 12,
            statements: [
                { id: 's9', content: 'a > 0, b < 0, c > 0, d < 0', isCorrect: false, order: 1, difficulty: 'VD' },
                { id: 's10', content: 'a < 0, b > 0, c < 0, d > 0', isCorrect: true, order: 2, difficulty: 'VDC' },
                { id: 's11', content: 'a > 0, b > 0, c < 0, d > 0', isCorrect: false, order: 3, difficulty: 'VD' },
                { id: 's12', content: 'a < 0, b < 0, c > 0, d < 0', isCorrect: false, order: 4, difficulty: 'VD' },
            ],
        },
        {
            id: '5',
            content: 'Tính giới hạn: lim(x→2) (x² - 4)/(x - 2)',
            type: 'SHORT_ANSWER',
            difficulty: 'NB',
            chapter: 'Chương 3',
            grade: 11,
            correctAnswer: '4',
        },
    ];

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <AlertCircle className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Chưa có câu hỏi nào</p>
                <p className="text-sm">Vui lòng thêm câu hỏi vào đề thi</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* Questions */}
            <div className="space-y-6">
                {questions.map((question, index) => (
                    <QuestionPreviewItem
                        key={question.id}
                        question={question}
                        index={index}
                    />
                ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>--- HẾT ---</p>
            </div>
        </div>
    );
};
