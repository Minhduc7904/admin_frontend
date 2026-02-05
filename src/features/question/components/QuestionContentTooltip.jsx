import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { MarkdownRenderer } from '../../../shared/components';

export const QuestionContentTooltip = ({ question, triggerRef, isVisible }) => {
    const [position, setPosition] = useState({ top: 0, left: 0, placement: 'bottom' });
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (isVisible && triggerRef?.current && tooltipRef?.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;
            
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            
            // Calculate space available
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.left;
            
            // Determine optimal placement
            const tooltipHeight = Math.min(tooltipRect.height || 400, 500); // max 500px
            const tooltipWidth = tooltipRect.width || 672; // max-w-2xl = 672px
            
            let top, left, placement;
            
            // Try bottom first
            if (spaceBelow >= tooltipHeight + 16 || spaceBelow > spaceAbove) {
                top = rect.bottom + scrollY + 8;
                placement = 'bottom';
            } else {
                // Place above
                top = rect.top + scrollY - tooltipHeight - 8;
                placement = 'top';
            }
            
            // Adjust horizontal position if needed
            if (spaceRight < tooltipWidth) {
                left = Math.max(scrollX + 16, rect.right + scrollX - tooltipWidth);
            } else {
                left = rect.left + scrollX;
            }
            
            setPosition({ top, left, placement });
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
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-4 max-h-[500px] overflow-y-auto">
                <MarkdownRenderer content={markdownContent} className="text-sm" imgClassNameSize="max-w-full max-h-[100px]" />
            </div>
        </div>,
        document.body
    );
};
