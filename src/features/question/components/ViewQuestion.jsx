import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MarkdownRenderer } from '../../../shared/components';
import { YoutubePreview } from '../../media/components/previews/YoutubePreview';
import { getQuestionByIdAsync } from '../store/questionSlice';
import { 
    getQuestionTypeLabel, 
    getQuestionTypeColor,
    getDifficultyLabel,
    getDifficultyColor
} from '../../../core/constants/question-constants';
import { GRADE_OPTIONS } from '../../../core/constants/grade-constants';
import { VISIBILITY_LABELS } from '../../../core/constants';
import { Calendar, User, BookOpen, Award, Eye, FileText, Youtube, Hash } from 'lucide-react';

export const ViewQuestion = ({ questionId }) => {
    const dispatch = useDispatch();
    const question = useSelector((state) => state.question.currentQuestion);
    const loading = useSelector((state) => state.question.loadingGet);
    const [showYoutubePreview, setShowYoutubePreview] = useState(false);

    useEffect(() => {
        if (questionId) {
            dispatch(getQuestionByIdAsync(questionId));
        }
    }, [questionId, dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="text-center text-foreground-light py-8">
                Không tìm thấy câu hỏi
            </div>
        );
    }

    const typeColors = getQuestionTypeColor(question.type);
    const typeLabel = getQuestionTypeLabel(question.type);
    const difficultyColors = question.difficulty ? getDifficultyColor(question.difficulty) : null;
    const difficultyLabel = question.difficulty ? getDifficultyLabel(question.difficulty) : null;
    const gradeLabel = question.grade ? GRADE_OPTIONS.find(g => g.value === question.grade)?.label : null;

    const statementLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    return (
        <div className="space-y-6 pb-6">
            {/* Header Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-foreground-light">
                    <Hash size={16} />
                    <span className="font-medium">ID:</span>
                    <span>{question.questionId}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeColors.bg} ${typeColors.text}`}>
                        {typeLabel}
                    </span>
                    
                    {difficultyColors && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${difficultyColors.bg} ${difficultyColors.text}`}>
                            {difficultyLabel}
                        </span>
                    )}

                    {gradeLabel && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                            {gradeLabel}
                        </span>
                    )}

                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        question.visibility === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                        question.visibility === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {VISIBILITY_LABELS[question.visibility] || question.visibility}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    {question.subjectName && (
                        <div className="flex items-center gap-2 text-foreground-light">
                            <BookOpen size={16} />
                            <span className="font-medium">Môn học:</span>
                            <span>{question.subjectName}</span>
                        </div>
                    )}

                    {question.pointsOrigin !== null && question.pointsOrigin !== undefined && (
                        <div className="flex items-center gap-2 text-foreground-light">
                            <Award size={16} />
                            <span className="font-medium">Điểm:</span>
                            <span>{question.pointsOrigin}</span>
                        </div>
                    )}

                    {question.createdAt && (
                        <div className="flex items-center gap-2 text-foreground-light">
                            <Calendar size={16} />
                            <span className="font-medium">Ngày tạo:</span>
                            <span>{new Date(question.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    )}

                    {question.updatedAt && (
                        <div className="flex items-center gap-2 text-foreground-light">
                            <Calendar size={16} />
                            <span className="font-medium">Cập nhật:</span>
                            <span>{new Date(question.updatedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    )}

                    {question.createdBy && (
                        <div className="flex items-center gap-2 text-foreground-light">
                            <User size={16} />
                            <span className="font-medium">Người tạo:</span>
                            <span>#{question.createdBy}</span>
                        </div>
                    )}
                </div>

                {question.questionChapters && question.questionChapters.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-2 text-sm text-foreground-light">
                            <FileText size={16} className="mt-0.5" />
                            <span className="font-medium">Chương:</span>
                            <div className="flex flex-wrap gap-1">
                                {question.questionChapters.map((qc, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs">
                                        {qc.chapter?.name || `Chapter ${qc.chapterId}`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Question Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Nội dung câu hỏi
                </h3>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                    <MarkdownRenderer content={question.processedContent || question.content} />
                </div>
            </div>

            {/* Statements */}
            {question.statements && question.statements.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Các đáp án</h3>
                    <div className="space-y-3">
                        {[...question.statements]
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map((stmt, idx) => (
                                <div 
                                    key={stmt.statementId} 
                                    className={`p-3 rounded-lg border ${
                                        stmt.isCorrect 
                                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                                            : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                            stmt.isCorrect 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                                        }`}>
                                            {statementLabels[idx] || idx + 1}
                                        </span>
                                        <div className="flex-1 prose prose-sm max-w-none dark:prose-invert">
                                            <MarkdownRenderer content={stmt.processedContent || stmt.content} />
                                        </div>
                                        {stmt.isCorrect && (
                                            <span className="flex-shrink-0 text-green-600 dark:text-green-400 font-bold">✓</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Correct Answer (for essay questions) */}
            {question.correctAnswer && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Award size={16} />
                        Đáp án đúng
                    </h3>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <MarkdownRenderer content={question.correctAnswer} />
                    </div>
                </div>
            )}

            {/* Solution */}
            {question.solution && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Eye size={16} />
                        Lời giải
                    </h3>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <MarkdownRenderer content={question.processedSolution || question.solution} />
                    </div>
                </div>
            )}

            {/* Solution YouTube */}
            {question.solutionYoutubeUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Youtube size={16} />
                            Video lời giải
                        </h3>
                        <button
                            onClick={() => setShowYoutubePreview(!showYoutubePreview)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            {showYoutubePreview ? 'Ẩn' : 'Hiển thị'}
                        </button>
                    </div>
                    <div className="text-sm text-foreground-light mb-2 break-all">
                        {question.solutionYoutubeUrl}
                    </div>
                    {showYoutubePreview && (
                        <YoutubePreview youtubeUrl={question.solutionYoutubeUrl} />
                    )}
                </div>
            )}
        </div>
    );
};
