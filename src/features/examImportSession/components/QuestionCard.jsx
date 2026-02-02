import { useState } from 'react';
import {
    Edit2,
    Trash2,
} from 'lucide-react';
import { ViewModeToggle } from '../../../shared/components';
import {
    getQuestionTypeLabel,
    getQuestionTypeColor,
    getDifficultyLabel,
    getDifficultyColor,
} from '../../../core/constants/question-constants';
import { QuestionContent } from './QuestionContent';
import { QuestionSolution } from './QuestionSolution';
import { StatementList } from './StatementList';

export const QuestionCard = ({
    question,
    index,
    onEditQuestion,
    onEditStatement,
    onCreateStatement,
    onDeleteQuestion,
    onDeleteStatement,
    onReorderStatements,
}) => {
    const [viewMode, setViewMode] = useState('preview');

    const typeColor = getQuestionTypeColor(question.type);
    const difficultyColor = question.difficulty
        ? getDifficultyColor(question.difficulty)
        : null;

    return (
        <div className="border border-border rounded-lg overflow-hidden transition hover:border-gray-400">
            {/* ================= Header ================= */}
            <div className="bg-gray-50 px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-gray-700">
                        Câu {index + 1}
                    </span>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span
                            className={`text-xs px-2 py-1 rounded ${typeColor.bg} ${typeColor.text}`}
                        >
                            {getQuestionTypeLabel(question.type)}
                        </span>

                        {question.difficulty && difficultyColor && (
                            <span
                                className={`text-xs px-2 py-1 rounded ${difficultyColor.bg} ${difficultyColor.text}`}
                            >
                                {getDifficultyLabel(question.difficulty)}
                            </span>
                        )}

                        {question.grade && (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                Khối {question.grade}
                            </span>
                        )}

                        {question.pointsOrigin && (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                {question.pointsOrigin} điểm
                            </span>
                        )}

                        <ViewModeToggle
                            viewMode={viewMode}
                            onChange={setViewMode}
                        />

                        {onEditQuestion && (
                            <button
                                onClick={() => onEditQuestion(question)}
                                className="
                                    p-1.5 rounded border border-gray-300
                                    text-gray-700 hover:bg-gray-100
                                    transition
                                "
                                title="Chỉnh sửa câu hỏi"
                            >
                                <Edit2 size={14} />
                            </button>
                        )}

                        {onDeleteQuestion && (
                            <button
                                onClick={() => onDeleteQuestion(question)}
                                className="
                                    p-1.5 rounded border border-red-300
                                    text-red-600 hover:bg-red-50
                                    transition
                                "
                                title="Xóa câu hỏi"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= Content ================= */}
            <div className="p-4 space-y-4">
                {/* Question content */}
                <QuestionContent question={question} viewMode={viewMode} />

                {/* ================= Statements ================= */}
                <StatementList
                    statements={question.tempStatements}
                    question={question}
                    viewMode={viewMode}
                    onEditStatement={onEditStatement}
                    onDeleteStatement={onDeleteStatement}
                    onCreateStatement={onCreateStatement}
                    onReorderStatements={onReorderStatements}
                />

                {/* ================= Solution ================= */}
                <QuestionSolution
                    solution={question.solution}
                    processedSolution={question.processedSolution}
                    viewMode={viewMode}
                />
            </div>
        </div>
    );
};
