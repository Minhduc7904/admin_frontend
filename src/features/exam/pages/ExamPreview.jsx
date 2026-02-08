import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MarkdownRenderer, Loading } from '../../../shared/components';
import {
    getExamByIdAsync,
    selectCurrentExam,
    selectExamLoadingGet,
} from '../store/examSlice';
import {
    getSectionsByExamAsync,
    selectSections,
    selectSectionLoadingGet,
} from '../store/sectionSlice';
import {
    getQuestionsByExamAsync,
    selectQuestions,
    selectQuestionLoadingGet,
} from '../../question/store/questionSlice';

/**
 * ExamPreview Component
 * Hiển thị preview đề thi với markdown
 * - Sections được sắp xếp theo order
 * - Trong mỗi section, questions được sắp xếp theo order
 * - Sau cùng là các câu hỏi chưa phân loại
 */
export const ExamPreview = () => {
    const { id } = useParams();
    const examId = Number(id);
    const dispatch = useDispatch();

    const exam = useSelector(selectCurrentExam);
    const sections = useSelector(selectSections);
    const questions = useSelector(selectQuestions);
    const loadingExam = useSelector(selectExamLoadingGet);
    const loadingSections = useSelector(selectSectionLoadingGet);
    const loadingQuestions = useSelector(selectQuestionLoadingGet);

    // Load exam data
    useEffect(() => {
        if (examId) {
            dispatch(getExamByIdAsync(examId));
            dispatch(getSectionsByExamAsync(examId));
            dispatch(getQuestionsByExamAsync({ examId }));
        }
    }, [examId, dispatch]);

    // Tạo markdown content cho toàn bộ đề thi
    const examMarkdown = useMemo(() => {
        if (!exam) {
            return '## Đang tải đề thi...\n\nVui lòng đợi.';
        }

        if (!questions || questions.length === 0) {
            return '## Chưa có câu hỏi nào\n\nVui lòng thêm câu hỏi vào đề thi.';
        }

        let markdown = `# ${exam.title || 'ĐỀ THI'}\n\n`;

        // Exam metadata
        const metadata = [];
        if (exam.subjectName) metadata.push(`**Môn học**: ${exam.subjectName}`);
        if (exam.grade) metadata.push(`**Khối**: ${exam.grade}`);
        if (exam.duration) metadata.push(`**Thời gian**: ${exam.duration} phút`);
        if (exam.totalPoints) metadata.push(`**Tổng điểm**: ${exam.totalPoints}`);

        if (metadata.length > 0) {
            markdown += `*${metadata.join(' | ')}*\n\n`;
        }

        // Exam description
        if (exam.processedDescription) {
            markdown += `${exam.processedDescription}\n\n`;
        } else if (exam.description) {
            markdown += `${exam.description}\n\n`;
        }

        markdown += '---\n\n';

        // Sort sections by order
        const sortedSections = sections 
            ? [...sections].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [];

        // Render questions by section
        sortedSections.forEach((section) => {
            // Get questions in this section, sorted by order
            const sectionQuestions = questions
                .filter(q => q.sectionId === section.sectionId)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            if (sectionQuestions.length === 0) return;

            // Section header
            markdown += `## ${section.title}\n\n`;
            
            // Section description if exists
            if (section.processedDescription) {
                markdown += `*${section.processedDescription}*\n\n`;
            } else if (section.description) {
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
        const uncategorizedQuestions = questions
            .filter(q => !q.sectionId)
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
    }, [exam, sections, questions]);

    const loading = loadingExam || loadingSections || loadingQuestions;

    if (loading && !exam) {
        return <Loading message="Đang tải đề thi..." />;
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
        metadata.push(`**Độ khó**: ${getDifficultyLabel(question.difficulty)}`);
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
    if (question.statements && question.statements.length > 0) {
        const sortedStatements = [...question.statements]
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        sortedStatements.forEach((statement, index) => {
            const label = statement.label || String.fromCharCode(65 + index); // A, B, C, D...
            const isCorrect = statement.isCorrect ? ' ✓' : '';
            
            if (statement.processedContent) {
                markdown += `**${label}.** ${statement.processedContent}${isCorrect}\n\n`;
            } else if (statement.content) {
                markdown += `**${label}.** ${statement.content}${isCorrect}\n\n`;
            }
        });

        markdown += '\n';
    }

    // Correct answer (if needed)
    if (question.correctAnswer) {
        markdown += `> **Đáp án đúng**: ${question.correctAnswer}\n\n`;
    }

    // Solution
    if (question.processedSolution || question.solution) {
        markdown += `---\n\n**💡 Lời giải:**\n\n`;
        if (question.processedSolution) {
            markdown += `${question.processedSolution}\n\n`;
        } else if (question.solution) {
            markdown += `${question.solution}\n\n`;
        }
    }

    // Solution YouTube URL
    if (question.solutionYoutubeUrl) {
        markdown += `📺 **Video hướng dẫn giải**: [Xem video](${question.solutionYoutubeUrl})\n\n`;
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

/**
 * Get difficulty label
 */
function getDifficultyLabel(difficulty) {
    const labels = {
        TH: 'Thông hiểu',
        NB: 'Nhận biết',
        VD: 'Vận dụng',
        VDC: 'Vận dụng cao',
    };
    return labels[difficulty] || difficulty;
}

export default ExamPreview;
