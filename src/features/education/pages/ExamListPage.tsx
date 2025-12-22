import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ExamPageHeader,
    ExamFilters,
    ExamStats,
    ExamTable,
    type Exam,
} from '@/features/education/components/examList';

export const ExamListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChapter, setSelectedChapter] = useState<string>('all');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data
    const exams: Exam[] = [
        {
            id: '1',
            title: 'Kiểm tra giữa kỳ 1 - Hàm số và Đồ thị',
            examCode: 'DE001',
            chapter: 'Chương 1',
            grade: 'Khối 12',
            difficulty: 'medium',
            questionCount: 30,
            status: 'published',
            createdDate: '01/12/2024',
        },
        {
            id: '2',
            title: 'Đề thi thử THPT Quốc gia - Đạo hàm',
            examCode: 'DE002',
            chapter: 'Chương 2',
            grade: 'Khối 12',
            difficulty: 'hard',
            questionCount: 50,
            status: 'published',
            createdDate: '28/11/2024',
        },
        {
            id: '3',
            title: 'Bài kiểm tra 15 phút - Giới hạn',
            examCode: 'DE003',
            chapter: 'Chương 3',
            grade: 'Khối 11',
            difficulty: 'easy',
            questionCount: 10,
            status: 'published',
            createdDate: '25/11/2024',
        },
        {
            id: '4',
            title: 'Kiểm tra cuối kỳ 1 - Tích phân',
            examCode: 'DE004',
            chapter: 'Chương 4',
            grade: 'Khối 12',
            difficulty: 'hard',
            questionCount: 40,
            status: 'draft',
            createdDate: '20/11/2024',
        },
        {
            id: '5',
            title: 'Đề ôn tập - Hình học không gian',
            examCode: 'DE005',
            chapter: 'Chương 5',
            grade: 'Khối 12',
            difficulty: 'medium',
            questionCount: 25,
            status: 'published',
            createdDate: '15/11/2024',
        },
        {
            id: '6',
            title: 'Kiểm tra thường xuyên - Lượng giác',
            examCode: 'DE006',
            chapter: 'Chương 1',
            grade: 'Khối 11',
            difficulty: 'easy',
            questionCount: 15,
            status: 'published',
            createdDate: '10/11/2024',
        },
        {
            id: '7',
            title: 'Đề thi HSG - Toán nâng cao',
            examCode: 'DE007',
            chapter: 'Chương 3',
            grade: 'Khối 12',
            difficulty: 'hard',
            questionCount: 35,
            status: 'archived',
            createdDate: '05/11/2024',
        },
        {
            id: '8',
            title: 'Bài tập về nhà - Phương trình bậc 2',
            examCode: 'DE008',
            chapter: 'Chương 2',
            grade: 'Khối 10',
            difficulty: 'easy',
            questionCount: 20,
            status: 'published',
            createdDate: '01/11/2024',
        },
        {
            id: '9',
            title: 'Kiểm tra học kỳ 2 - Tổng hợp',
            examCode: 'DE009',
            chapter: 'Chương 4',
            grade: 'Khối 11',
            difficulty: 'medium',
            questionCount: 45,
            status: 'draft',
            createdDate: '28/10/2024',
        },
        {
            id: '10',
            title: 'Đề cương ôn thi - Giải tích',
            examCode: 'DE010',
            chapter: 'Chương 5',
            grade: 'Khối 12',
            difficulty: 'medium',
            questionCount: 30,
            status: 'published',
            createdDate: '20/10/2024',
        },
    ];

    // Calculate pagination
    const totalPages = Math.ceil(exams.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedExams = exams.slice(startIndex, endIndex);

    // Handlers
    const handleAddExam = () => {
        console.log('Add exam clicked');
    };

    const handleView = (id: string) => {
        navigate(`/education/exams/${id}`);
    };

    const handleEdit = (id: string) => {
        console.log('Edit exam:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete exam:', id);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <ExamPageHeader onAddClick={handleAddExam} />

            <ExamFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedChapter={selectedChapter}
                onChapterChange={setSelectedChapter}
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={setSelectedDifficulty}
            />

            <ExamStats
                totalExams={exams.length}
                publishedExams={exams.filter((e) => e.status === 'published').length}
                draftExams={exams.filter((e) => e.status === 'draft').length}
                archivedExams={exams.filter((e) => e.status === 'archived').length}
            />

            <ExamTable
                exams={paginatedExams}
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
