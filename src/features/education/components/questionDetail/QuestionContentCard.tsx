import React from 'react';
import { Card } from '@/shared/components/ui';
import { FileText, Youtube } from 'lucide-react';
import type { Question } from '../questionList/QuestionTableRow';

interface QuestionContentCardProps {
    question: Question;
    solution?: string;
    solutionYoutubeUrl?: string;
}

const getTypeText = (type: Question['type']) => {
    switch (type) {
        case 'SINGLE_CHOICE':
            return 'Trắc nghiệm';
        case 'TRUE_FALSE':
            return 'Đúng/Sai';
        case 'SHORT_ANSWER':
            return 'Trả lời ngắn';
        default:
            return type;
    }
};

const getTypeColor = (type: Question['type']) => {
    switch (type) {
        case 'SINGLE_CHOICE':
            return 'bg-blue-100 text-blue-700';
        case 'TRUE_FALSE':
            return 'bg-purple-100 text-purple-700';
        case 'SHORT_ANSWER':
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getDifficultyText = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
        case 'TH':
            return 'Thông hiểu';
        case 'NB':
            return 'Nhận biết';
        case 'VD':
            return 'Vận dụng';
        case 'VDC':
            return 'Vận dụng cao';
        default:
            return difficulty;
    }
};

const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
        case 'TH':
            return 'bg-cyan-100 text-cyan-700';
        case 'NB':
            return 'bg-green-100 text-green-700';
        case 'VD':
            return 'bg-orange-100 text-orange-700';
        case 'VDC':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export const QuestionContentCard: React.FC<QuestionContentCardProps> = ({
    question,
    solution,
    solutionYoutubeUrl,
}) => {
    return (
        <div className="space-y-6">
            {/* Question Info Card */}
            <Card>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(question.type)}`}>
                            {getTypeText(question.type)}
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                            {getDifficultyText(question.difficulty)}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                            {question.chapter}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                            Khối {question.grade}
                        </span>
                    </div>
                    
                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 mb-2">Nội dung câu hỏi</h2>
                        <p className="text-base text-gray-900 leading-relaxed">{question.content}</p>
                    </div>
                </div>
            </Card>

            {/* Statements/Answer Card */}
            {question.statements && question.statements.length > 0 && (
                <Card>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        {question.type === 'TRUE_FALSE' ? 'Mệnh đề' : 'Đáp án'}
                    </h2>
                    <div className="space-y-3">
                        {question.statements.map((statement, index) => (
                            <div
                                key={statement.id}
                                className={`p-3 rounded-lg border-2 ${
                                    statement.isCorrect
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-gray-200 bg-white'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="font-bold text-gray-900 min-w-[24px]">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 mb-2">{statement.content}</p>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-0.5 text-xs font-medium rounded ${
                                                    statement.isCorrect
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {statement.isCorrect ? 'Đúng' : 'Sai'}
                                            </span>
                                            {statement.difficulty && (
                                                <span
                                                    className={`px-2 py-0.5 text-xs font-medium rounded ${getDifficultyColor(
                                                        statement.difficulty
                                                    )}`}
                                                >
                                                    {getDifficultyText(statement.difficulty)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {question.type === 'SHORT_ANSWER' && question.correctAnswer && (
                <Card>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Đáp án đúng</h2>
                    <div className="p-3 rounded-lg bg-green-50 border-2 border-green-200">
                        <p className="text-base text-gray-900 font-medium">{question.correctAnswer}</p>
                    </div>
                </Card>
            )}

            {/* Solution Card */}
            {solution && (
                <Card>
                    <div className="flex items-center gap-2 mb-3">
                        <FileText size={18} className="text-gray-700" />
                        <h2 className="text-sm font-semibold text-gray-700">Lời giải chi tiết</h2>
                    </div>
                    <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{solution}</p>
                    </div>
                </Card>
            )}

            {/* YouTube Solution Card */}
            {solutionYoutubeUrl && (
                <Card>
                    <div className="flex items-center gap-2 mb-3">
                        <Youtube size={18} className="text-red-600" />
                        <h2 className="text-sm font-semibold text-gray-700">Video hướng dẫn</h2>
                    </div>
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <iframe
                            width="100%"
                            height="100%"
                            src={solutionYoutubeUrl}
                            title="Video hướng dẫn giải"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                </Card>
            )}
        </div>
    );
};
