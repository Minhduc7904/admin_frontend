import React from 'react';
import { Card, Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface ExamFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedChapter: string;
    onChapterChange: (chapter: string) => void;
    selectedGrade: string;
    onGradeChange: (grade: string) => void;
    selectedDifficulty: string;
    onDifficultyChange: (difficulty: string) => void;
}

export const ExamFilters: React.FC<ExamFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedChapter,
    onChapterChange,
    selectedGrade,
    onGradeChange,
    selectedDifficulty,
    onDifficultyChange,
}) => {
    const chapterOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả chương' },
        { value: 'chapter-1', label: 'Chương 1: Hàm số và Đồ thị' },
        { value: 'chapter-2', label: 'Chương 2: Đạo hàm' },
        { value: 'chapter-3', label: 'Chương 3: Giới hạn' },
        { value: 'chapter-4', label: 'Chương 4: Tích phân' },
        { value: 'chapter-5', label: 'Chương 5: Hình học không gian' },
    ];

    const gradeOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả khối' },
        { value: 'grade-10', label: 'Khối 10' },
        { value: 'grade-11', label: 'Khối 11' },
        { value: 'grade-12', label: 'Khối 12' },
    ];

    const difficultyOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả mức độ' },
        { value: 'easy', label: 'Dễ' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'hard', label: 'Khó' },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Tìm kiếm đề thi..."
                />
                <Dropdown
                    options={chapterOptions}
                    value={selectedChapter}
                    onChange={onChapterChange}
                    placeholder="Chọn chương"
                />
                <Dropdown
                    options={gradeOptions}
                    value={selectedGrade}
                    onChange={onGradeChange}
                    placeholder="Chọn khối"
                />
                <Dropdown
                    options={difficultyOptions}
                    value={selectedDifficulty}
                    onChange={onDifficultyChange}
                    placeholder="Chọn mức độ"
                />
            </div>
        </Card>
    );
};
