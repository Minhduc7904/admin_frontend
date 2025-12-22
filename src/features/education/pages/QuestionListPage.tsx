import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    QuestionPageHeader,
    QuestionFilters,
    QuestionStats,
    QuestionTable,
    type Question,
} from '@/features/education/components/questionList';

export const QuestionListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChapter, setSelectedChapter] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data
    const questions: Question[] = [
        {
            id: '1',
            content: 'Cho hàm số y = f(x) có đạo hàm trên R và có đồ thị như hình vẽ. Hỏi hàm số y = f(x) nghịch biến trên khoảng nào?',
            type: 'SINGLE_CHOICE',
            difficulty: 'TH',
            chapter: 'Chương 1',
            grade: 12,
            statements: [
                { id: 's1', content: '(-∞; 0)', isCorrect: false, order: 1, difficulty: 'TH' },
                { id: 's2', content: '(0; 2)', isCorrect: true, order: 2, difficulty: 'TH' },
                { id: 's3', content: '(2; +∞)', isCorrect: false, order: 3, difficulty: 'TH' },
                { id: 's4', content: '(-∞; 2)', isCorrect: false, order: 4, difficulty: 'TH' },
            ],
            createdAt: '15/12/2024',
        },
        {
            id: '2',
            content: 'Cho hàm số f(x) = x³ - 3x² + 2. Xét tính đúng sai của các mệnh đề sau:',
            type: 'TRUE_FALSE',
            difficulty: 'VD',
            chapter: 'Chương 2',
            grade: 12,
            statements: [
                { id: 's5', content: 'Hàm số đồng biến trên khoảng (2; +∞)', isCorrect: true, order: 1, difficulty: 'NB' },
                { id: 's6', content: 'Hàm số có hai điểm cực trị', isCorrect: true, order: 2, difficulty: 'TH' },
                { id: 's7', content: 'Giá trị nhỏ nhất của hàm số trên [0; 3] là -2', isCorrect: false, order: 3, difficulty: 'VD' },
                { id: 's8', content: 'Đồ thị hàm số cắt trục hoành tại ba điểm phân biệt', isCorrect: false, order: 4, difficulty: 'VDC' },
            ],
            createdAt: '14/12/2024',
        },
        {
            id: '3',
            content: 'Tính đạo hàm của hàm số y = (2x + 1)/(x - 3)',
            type: 'SHORT_ANSWER',
            difficulty: 'NB',
            chapter: 'Chương 2',
            grade: 11,
            correctAnswer: 'y\' = -7/(x-3)²',
            createdAt: '13/12/2024',
        },
        {
            id: '4',
            content: 'Cho hàm số y = ax³ + bx² + cx + d (a ≠ 0) có đồ thị như hình vẽ. Tìm mối quan hệ giữa các hệ số a, b, c, d.',
            type: 'SINGLE_CHOICE',
            difficulty: 'VDC',
            chapter: 'Chương 1',
            grade: 12,
            statements: [
                { id: 's9', content: 'a > 0, b < 0, c > 0, d < 0', isCorrect: false, order: 1, difficulty: 'VD' },
                { id: 's10', content: 'a < 0, b > 0, c < 0, d > 0', isCorrect: true, order: 2, difficulty: 'VDC' },
                { id: 's11', content: 'a > 0, b > 0, c < 0, d > 0', isCorrect: false, order: 3, difficulty: 'VD' },
                { id: 's12', content: 'a < 0, b < 0, c > 0, d < 0', isCorrect: false, order: 4, difficulty: 'VD' },
            ],
            createdAt: '12/12/2024',
        },
        {
            id: '5',
            content: 'Tính giới hạn: lim(x→2) (x² - 4)/(x - 2)',
            type: 'SHORT_ANSWER',
            difficulty: 'NB',
            chapter: 'Chương 3',
            grade: 11,
            correctAnswer: '4',
            createdAt: '11/12/2024',
        },
        {
            id: '6',
            content: 'Cho hình chóp S.ABCD có đáy là hình vuông cạnh a, SA vuông góc với mặt phẳng đáy và SA = a√2. Xét tính đúng sai:',
            type: 'TRUE_FALSE',
            difficulty: 'VD',
            chapter: 'Chương 5',
            grade: 12,
            statements: [
                { id: 's13', content: 'Thể tích khối chóp bằng a³√2/3', isCorrect: true, order: 1, difficulty: 'TH' },
                { id: 's14', content: 'Góc giữa SC và mặt phẳng đáy bằng 45°', isCorrect: false, order: 2, difficulty: 'VD' },
                { id: 's15', content: 'Khoảng cách từ A đến mặt phẳng (SBD) bằng a√6/3', isCorrect: true, order: 3, difficulty: 'VDC' },
                { id: 's16', content: 'Diện tích mặt cầu ngoại tiếp hình chóp bằng 3πa²', isCorrect: false, order: 4, difficulty: 'VDC' },
            ],
            createdAt: '10/12/2024',
        },
        {
            id: '7',
            content: 'Tìm nguyên hàm của hàm số f(x) = 3x² + 2x - 1',
            type: 'SHORT_ANSWER',
            difficulty: 'NB',
            chapter: 'Chương 4',
            grade: 12,
            correctAnswer: 'F(x) = x³ + x² - x + C',
            createdAt: '09/12/2024',
        },
        {
            id: '8',
            content: 'Trong không gian Oxyz, cho ba điểm A(1;0;0), B(0;1;0), C(0;0;1). Phương trình mặt phẳng (ABC) là:',
            type: 'SINGLE_CHOICE',
            difficulty: 'TH',
            chapter: 'Chương 5',
            grade: 12,
            statements: [
                { id: 's17', content: 'x + y + z = 1', isCorrect: true, order: 1, difficulty: 'TH' },
                { id: 's18', content: 'x + y + z = 0', isCorrect: false, order: 2, difficulty: 'NB' },
                { id: 's19', content: 'x - y + z = 1', isCorrect: false, order: 3, difficulty: 'NB' },
                { id: 's20', content: 'x + y - z = 1', isCorrect: false, order: 4, difficulty: 'NB' },
            ],
            createdAt: '08/12/2024',
        },
    ];

    // Calculate pagination
    const totalPages = Math.ceil(questions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedQuestions = questions.slice(startIndex, endIndex);

    // Handlers
    const handleAddQuestion = () => {
        console.log('Add question clicked');
    };

    const handleView = (id: string) => {
        navigate(`/education/questions/${id}`);
    };

    const handleEdit = (id: string) => {
        console.log('Edit question:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete question:', id);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Calculate stats
    const thCount = questions.filter(q => q.difficulty === 'TH').length;
    const nbCount = questions.filter(q => q.difficulty === 'NB').length;
    const vdCount = questions.filter(q => q.difficulty === 'VD').length;
    const vdcCount = questions.filter(q => q.difficulty === 'VDC').length;

    return (
        <>
            <QuestionPageHeader onAddClick={handleAddQuestion} />

            <QuestionFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedChapter={selectedChapter}
                onChapterChange={setSelectedChapter}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={setSelectedDifficulty}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
            />

            <QuestionStats
                totalQuestions={questions.length}
                thCount={thCount}
                nbCount={nbCount}
                vdCount={vdCount}
                vdcCount={vdcCount}
            />

            <QuestionTable
                questions={paginatedQuestions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    );
};
