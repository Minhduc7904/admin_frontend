import { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Edit, Trash2, Plus } from 'lucide-react';
import { MarkdownRenderer } from '../../../shared/components/markdown/MarkdownRenderer';
import { ViewModeToggle } from '../../../shared/components/ui/ViewModeToggle';
import { YoutubePreview } from '../../media/components/previews/YoutubePreview';

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

export const ExamQuestionCard = ({ question, index, isDragging = false, isDragOver = false, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, onEdit, onRemove, onAddToExam }) => {
    const [viewMode, setViewMode] = useState('text'); // 'text' or 'preview'
    const [showVideo, setShowVideo] = useState(false);

    const handleDragStart = (e) => {
        // Create simple ghost element
        const ghost = document.createElement('div');
        ghost.className = 'bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg font-medium';
        ghost.style.position = 'absolute';
        ghost.style.top = '-1000px';
        ghost.textContent = `Câu ${index + 1}`;
        document.body.appendChild(ghost);
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setDragImage(ghost, 0, 0);
        
        setTimeout(() => document.body.removeChild(ghost), 0);
        
        if (onDragStart) onDragStart(e);
    };

    return (
        <div 
            className={`
                bg-white border rounded-lg p-4 hover:border-blue-300 transition-all
                ${onDragStart ? 'cursor-move hover:shadow-md' : ''}
                ${isDragging ? 'opacity-40 scale-95' : ''}
                ${isDragOver ? 'border-t-4 border-t-blue-500 border-l-2 border-r-2 border-b-2 border-l-blue-400 border-r-blue-400 border-b-blue-400 shadow-lg' : 'border-gray-200'}
            `}
            draggable={!!onDragStart}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
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
                <div className="flex items-center gap-2">
                    {/* Add to Exam Button */}
                    {onAddToExam && (
                        <button
                            onClick={() => onAddToExam(question)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shadow-sm flex items-center gap-1"
                            title="Thêm vào đề thi"
                        >
                            <Plus size={16} />
                            Thêm vào đề
                        </button>
                    )}
                    {/* Remove Button */}
                    {onRemove && (
                        <button
                            onClick={() => onRemove(question)}
                            className="p-1 hover:bg-red-100 rounded-md transition-colors"
                            title="Gỡ câu hỏi khỏi đề thi"
                        >
                            <Trash2 size={18} className="text-red-600" />
                        </button>
                    )}
                    {/* Edit Button */}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(question)}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            title="Chỉnh sửa câu hỏi"
                        >
                            <Edit size={18} className="text-gray-600" />
                        </button>
                    )}
                    {/* Mode Switch */}
                    <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
                </div>
            </div>

            {/* Question Content */}
            <div className="text-sm text-gray-900 mb-4">
                {viewMode === 'preview' ? (
                    <MarkdownRenderer content={question.processedContent || question.content} />
                ) : (
                    <div className="whitespace-pre-wrap">{question.content}</div>
                )}
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
                            <div className="flex-1 text-sm text-gray-900">
                                {viewMode === 'preview' ? (
                                    <MarkdownRenderer content={statement.processedContent || statement.content} />
                                ) : (
                                    <div className="whitespace-pre-wrap">{statement.content}</div>
                                )}
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
                    <div className="text-sm text-blue-900">
                        {viewMode === 'preview' ? (
                            <MarkdownRenderer content={question.processedSolution || question.solution} />
                        ) : (
                            <div className="whitespace-pre-wrap">{question.solution}</div>
                        )}
                    </div>
                </div>
            )}

            {/* Solution YouTube URL */}
            {question.solutionYoutubeUrl && (
                <div className="mt-3">
                    <button
                        onClick={() => setShowVideo(!showVideo)}
                        className="flex items-center bg-primary gap-2 text-sm font-medium text-blue-600 hover:underline transition-colors mb-2"
                    >
                        {showVideo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        Video hướng dẫn giải
                    </button>
                    {showVideo && (
                        <YoutubePreview youtubeUrl={question.solutionYoutubeUrl} />
                    )}
                </div>
            )}
        </div>
    );
};
