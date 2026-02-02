import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownRenderer } from '../../../shared/components';

export const QuestionSolution = ({ solution, processedSolution, viewMode }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!solution) return null;

    return (
        <div>
            <button
                onClick={() => setIsExpanded((v) => !v)}
                className="
                    w-full flex items-center gap-2
                    text-sm font-medium text-gray-700
                    hover:text-gray-900 transition
                "
            >
                <BookOpen className="w-4 h-4" />
                Lời giải
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 ml-auto" />
                ) : (
                    <ChevronDown className="w-4 h-4 ml-auto" />
                )}
            </button>

            {isExpanded && (
                <div className="mt-3 p-4 bg-gray-50 rounded border">
                    {viewMode === 'preview' ? (
                        <div className="prose prose-sm max-w-none">
                            <MarkdownRenderer
                                content={processedSolution || solution}
                            />
                        </div>
                    ) : (
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                            {solution}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
};
