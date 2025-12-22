import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Clock, CheckCircle, XCircle, Eye, Award, Shield } from 'lucide-react';

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

interface SessionPermissions {
    showResultDetail: boolean;
    allowViewScore: boolean;
    allowViewAnswer: boolean;
    allowLeaderboard: boolean;
    enableAntiCheating: boolean;
}

interface ExamSessionPreviewTabProps {
    sessionId: string;
    sessionInfo: {
        title: string;
        examCode: string;
        durationMinutes: number;
        startDate: string;
        endDate: string;
    } & SessionPermissions;
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
            return String.fromCharCode(97 + order - 1);
        }
        return String.fromCharCode(65 + order - 1);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
                                <p className="flex-1 text-gray-700 pt-1">{statement.content}</p>
                            </div>
                        ))}
                </div>
            )}

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
                                        <p className="flex-1 text-gray-700">{statement.content}</p>
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

const Timer: React.FC<{ durationMinutes: number }> = ({ durationMinutes }) => {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const isLowTime = timeLeft < 300; // Less than 5 minutes

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isLowTime ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}
        >
            <Clock className="w-5 h-5" />
            <div>
                <div className="text-xs font-medium opacity-90">Thời gian còn lại</div>
                <div className="text-2xl font-bold tabular-nums">
                    {hours > 0 && `${hours.toString().padStart(2, '0')}:`}
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>
        </div>
    );
};

const PermissionsBadge: React.FC<{ permissions: SessionPermissions }> = ({ permissions }) => {
    const permissionItems = [
        {
            key: 'showResultDetail',
            label: 'Xem chi tiết kết quả',
            icon: Eye,
            enabled: permissions.showResultDetail,
        },
        {
            key: 'allowViewScore',
            label: 'Xem điểm số',
            icon: CheckCircle,
            enabled: permissions.allowViewScore,
        },
        {
            key: 'allowViewAnswer',
            label: 'Xem đáp án',
            icon: FileText,
            enabled: permissions.allowViewAnswer,
        },
        {
            key: 'allowLeaderboard',
            label: 'Xem bảng xếp hạng',
            icon: Award,
            enabled: permissions.allowLeaderboard,
        },
        {
            key: 'enableAntiCheating',
            label: 'Chống gian lận',
            icon: Shield,
            enabled: permissions.enableAntiCheating,
        },
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quyền hạn</h3>
            <div className="space-y-2">
                {permissionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.key} className="flex items-center gap-2 text-sm">
                            {item.enabled ? (
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className={item.enabled ? 'text-gray-700' : 'text-gray-400'}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const ExamSessionPreviewTab: React.FC<ExamSessionPreviewTabProps> = ({
    sessionId,
    sessionInfo,
}) => {
    // Mock data
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
    ];

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <AlertCircle className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Chưa có câu hỏi nào</p>
                <p className="text-sm">Vui lòng thêm câu hỏi vào cuộc thi</p>
            </div>
        );
    }

    return (
        <div className="flex gap-6 p-6">
            {/* Main Content */}
            <div className="flex-1 max-w-5xl">
                {/* Exam Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">{sessionInfo.title}</h1>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <div>
                            <span className="opacity-90">Mã đề:</span>
                            <span className="font-semibold ml-2">{sessionInfo.examCode}</span>
                        </div>
                        <div>
                            <span className="opacity-90">Số câu hỏi:</span>
                            <span className="font-semibold ml-2">{questions.length}</span>
                        </div>
                        <div>
                            <span className="opacity-90">Thời gian:</span>
                            <span className="font-semibold ml-2">{sessionInfo.durationMinutes} phút</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-500 text-sm">
                        <div className="flex items-center gap-4">
                            <div>
                                <span className="opacity-90">Bắt đầu:</span>
                                <span className="font-semibold ml-2">{sessionInfo.startDate}</span>
                            </div>
                            <div>
                                <span className="opacity-90">Kết thúc:</span>
                                <span className="font-semibold ml-2">{sessionInfo.endDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Hướng dẫn làm bài
                    </h3>
                    <ul className="text-sm text-yellow-700 space-y-1 ml-7">
                        <li>• Đề thi gồm {questions.length} câu hỏi, thời gian làm bài {sessionInfo.durationMinutes} phút</li>
                        <li>• Đọc kỹ đề bài và chọn đáp án chính xác nhất</li>
                        <li>• Với câu hỏi đúng/sai, đánh giá từng mệnh đề</li>
                        <li>• Với câu hỏi tự luận, nhập câu trả lời vào ô trống</li>
                        {sessionInfo.enableAntiCheating && (
                            <li className="text-red-600 font-medium">
                                • Hệ thống chống gian lận đang được bật. Mọi hành vi gian lận sẽ bị ghi nhận
                            </li>
                        )}
                    </ul>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {questions.map((question, index) => (
                        <QuestionPreviewItem key={question.id} question={question} index={index} />
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Nộp bài
                    </button>
                    <p className="mt-4 text-sm text-gray-500">--- HẾT ---</p>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 space-y-4">
                <Timer durationMinutes={sessionInfo.durationMinutes} />
                <PermissionsBadge
                    permissions={{
                        showResultDetail: sessionInfo.showResultDetail,
                        allowViewScore: sessionInfo.allowViewScore,
                        allowViewAnswer: sessionInfo.allowViewAnswer,
                        allowLeaderboard: sessionInfo.allowLeaderboard,
                        enableAntiCheating: sessionInfo.enableAntiCheating,
                    }}
                />
            </div>
        </div>
    );
};
