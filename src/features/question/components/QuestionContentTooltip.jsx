import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { MarkdownRenderer } from '../../../shared/components';

export const QuestionContentTooltip = ({ question, triggerRef, isVisible }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (isVisible && triggerRef?.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;
            
            setPosition({
                top: rect.bottom + scrollY + 8,
                left: rect.left + scrollX,
            });
        }
    }, [isVisible, triggerRef]);

    if (!isVisible) return null;

    // Build complete markdown content string
    const statementLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const sortedStatements = question.statements && question.statements.length > 0
        ? [...question.statements].sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];

    let markdownContent = `**Nội dung câu hỏi:**\n\n${question.processedContent}`;
    
    if (sortedStatements.length > 0) {
        markdownContent += '\n\n**Các đáp án:**\n\n';
        sortedStatements.forEach((stmt, idx) => {
            const label = statementLabels[idx] || (idx + 1);
            const checkmark = stmt.isCorrect ? ' ✓' : '';
            const prefix = stmt.isCorrect ? '**' : '';
            const suffix = stmt.isCorrect ? '**' : '';
            markdownContent += `${prefix}${label}. ${stmt.processedContent}${checkmark}${suffix}\n\n`;
        });
    }

    return createPortal(
        <div
            ref={tooltipRef}
            className="fixed z-[9999] max-w-2xl transition-opacity duration-150"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                opacity: position.top > 0 ? 1 : 0,
            }}
        >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-4">
                <MarkdownRenderer content={markdownContent} className="text-sm" imgClassNameSize="max-w-full max-h-[100px]" />
            </div>
        </div>,
        document.body
    );
};
