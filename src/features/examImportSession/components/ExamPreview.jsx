import { useMemo } from 'react';
import { MarkdownRenderer } from '../../../shared/components';

/**
 * ExamPreview Component
 * Hiển thị preview đề thi với markdown
 * - Sections được sắp xếp theo order
 * - Trong mỗi section, questions được sắp xếp theo order
 * - Sau cùng là các câu hỏi chưa phân loại
 */
export const ExamPreview = ({ tempSections, tempQuestions, loading }) => {
    // Tạo markdown content cho toàn bộ đề thi
    const examMarkdown = useMemo(() => {
        if (!tempQuestions || tempQuestions.length === 0) {
            return '## Chưa có câu hỏi nào\n\nVui lòng thêm câu hỏi vào đề thi.';
        }

        let markdown = '# ĐỀ THI\n\n';

        // Sort sections by order
        const sortedSections = tempSections 
            ? [...tempSections].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [];

        // Render questions by section
        sortedSections.forEach((section) => {
            // Get questions in this section, sorted by order
            const sectionQuestions = tempQuestions
                .filter(q => q.tempSectionId === section.tempSectionId)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            if (sectionQuestions.length === 0) return;

            // Section header
            markdown += `## ${section.title}\n\n`;
            
            // Section description if exists
            if (section.description) {
                markdown += `*${section.description}*\n\n`;
            }

            // Reset counter for each section
            let questionCounter = 1;

            // Render each question in section
            sectionQuestions.forEach((question) => {
                markdown += renderQuestion(question, questionCounter);
                questionCounter++;
            });

            markdown += '\n---\n\n';
        });

        // Render uncategorized questions
        const uncategorizedQuestions = tempQuestions
            .filter(q => !q.tempSectionId)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        if (uncategorizedQuestions.length > 0) {
            markdown += `## Câu hỏi chưa phân loại\n\n`;
            
            // Reset counter for uncategorized section
            let questionCounter = 1;
            
            uncategorizedQuestions.forEach((question) => {
                markdown += renderQuestion(question, questionCounter);
                questionCounter++;
            });
        }

        return markdown;
    }, [tempSections, tempQuestions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải đề thi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
            <MarkdownRenderer content={examMarkdown} />
        </div>
    );
};

/**
 * Render một câu hỏi thành markdown
 * @param {Object} question - Question object
 * @param {number} counter - Question number
 * @returns {string} Markdown string
 */
function renderQuestion(question, counter) {
    let markdown = `### Câu ${counter}\n\n`;

    // Question metadata (type, difficulty, grade, points)
    const metadata = [];
    if (question.type) {
        metadata.push(`**Loại**: ${getQuestionTypeLabel(question.type)}`);
    }
    if (question.difficulty) {
        metadata.push(`**Độ khó**: ${question.difficulty}`);
    }
    if (question.grade) {
        metadata.push(`**Khối**: ${question.grade}`);
    }
    if (question.pointsOrigin) {
        metadata.push(`**Điểm**: ${question.pointsOrigin}`);
    }

    if (metadata.length > 0) {
        markdown += `*${metadata.join(' | ')}*\n\n`;
    }

    // Question content
    if (question.processedContent) {
        markdown += `${question.processedContent}\n\n`;
    } else if (question.content) {
        markdown += `${question.content}\n\n`;
    }

    // Statements (if any)
    if (question.tempStatements && question.tempStatements.length > 0) {
        const sortedStatements = [...question.tempStatements]
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        sortedStatements.forEach((statement, index) => {
            const label = statement.label || String.fromCharCode(65 + index); // A, B, C, D...
            
            if (statement.processedContent) {
                markdown += `**${label}.** ${statement.processedContent}\n\n`;
            } else if (statement.content) {
                markdown += `**${label}.** ${statement.content}\n\n`;
            }
        });
    }

    // Solution
    if (question.processedSolution) {
        markdown += `**Lời giải:**\n\n${question.processedSolution}\n\n`;
    } else if (question.solution) {
        markdown += `**Lời giải:**\n\n${question.solution}\n\n`;
    }

    markdown += '\n';
    return markdown;
}

/**
 * Get question type label
 */
function getQuestionTypeLabel(type) {
    const labels = {
        SINGLE_CHOICE: 'Trắc nghiệm 1 đáp án',
        MULTIPLE_CHOICE: 'Trắc nghiệm nhiều đáp án',
        TRUE_FALSE: 'Đúng/Sai',
        SHORT_ANSWER: 'Trả lời ngắn',
        ESSAY: 'Tự luận',
    };
    return labels[type] || type;
}

export default ExamPreview;
