import React from 'react';
import { useParams } from 'react-router-dom';
import {
    QuestionDetailHeader,
    QuestionContentCard,
    QuestionExamUsageCard,
    type ExamUsage,
} from '@/features/education/components/questionDetail';
import type { Question } from '@/features/education/components/questionList';

export const QuestionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Mock question data
    const question: Question = {
        id: id || '1',
        content: 'Cho hàm số y = f(x) có đạo hàm trên R và có đồ thị như hình vẽ. Hỏi hàm số y = f(x) nghịch biến trên khoảng nào?',
        type: 'SINGLE_CHOICE',
        difficulty: 'TH',
        chapter: 'Chương 1: Hàm số',
        grade: 12,
        statements: [
            { id: 's1', content: '(-∞; 0)', isCorrect: false, order: 1, difficulty: 'TH' },
            { id: 's2', content: '(0; 2)', isCorrect: true, order: 2, difficulty: 'TH' },
            { id: 's3', content: '(2; +∞)', isCorrect: false, order: 3, difficulty: 'TH' },
            { id: 's4', content: '(-∞; 2)', isCorrect: false, order: 4, difficulty: 'TH' },
        ],
        createdAt: '15/12/2024',
    };

    // Mock solution
    const solution = `Bước 1: Xét dấu của đạo hàm f'(x)
Từ đồ thị ta thấy:
- f'(x) > 0 khi x ∈ (-∞; 0) ∪ (2; +∞)
- f'(x) < 0 khi x ∈ (0; 2)
- f'(x) = 0 khi x = 0 hoặc x = 2

Bước 2: Kết luận
Hàm số y = f(x) nghịch biến trên khoảng (0; 2) vì f'(x) < 0 trên khoảng này.

Đáp án: B`;

    // Mock YouTube URL (embedded format)
    const solutionYoutubeUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

    // Mock exam usage data
    const examUsages: ExamUsage[] = [
        {
            id: 'exam1',
            examCode: 'DE001',
            examTitle: 'Đề kiểm tra giữa kỳ 1 - Hàm số và đạo hàm',
            grade: 12,
            usedDate: '10/12/2024',
            studentCount: 145,
        },
        {
            id: 'exam2',
            examCode: 'DE015',
            examTitle: 'Đề thi thử THPT Quốc gia 2024',
            grade: 12,
            usedDate: '05/11/2024',
            studentCount: 320,
        },
        {
            id: 'exam3',
            examCode: 'DE028',
            examTitle: 'Đề ôn tập chương 1 - Ứng dụng đạo hàm',
            grade: 12,
            usedDate: '28/10/2024',
            studentCount: 98,
        },
    ];

    return (
        <div className="space-y-6">
            <QuestionDetailHeader questionId={question.id} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Question content (2/3 width) */}
                <div className="lg:col-span-2">
                    <QuestionContentCard
                        question={question}
                        solution={solution}
                        solutionYoutubeUrl={solutionYoutubeUrl}
                    />
                </div>

                {/* Right column - Exam usage (1/3 width) */}
                <div className="lg:col-span-1">
                    <QuestionExamUsageCard exams={examUsages} />
                </div>
            </div>
        </div>
    );
};
