import { MarkdownRenderer } from '../../../shared/components';

export const QuestionContent = ({ question, viewMode }) => {
    return (
        <div>
            {viewMode === 'preview' ? (
                <div className="prose prose-sm max-w-none">
                    <MarkdownRenderer
                        content={question.processedContent || question.content}
                    />
                </div>
            ) : (
                <pre className="text-xs whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border">
                    {question.content}
                </pre>
            )}

            {/* Correct Answer */}
            {question.correctAnswer && (
                <div className="flex items-center gap-2 px-3 py-2 rounded border border-green-300 bg-green-50 mt-4">
                    <span className="text-xs font-semibold text-green-700">
                        Đáp án đúng:
                    </span>
                    <span className="text-sm font-medium text-green-800">
                        {question.correctAnswer}
                    </span>
                </div>
            )}
        </div>
    );
};
