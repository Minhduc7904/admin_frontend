import React from 'react';
import { Card, Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface QuestionFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedChapter: string;
    onChapterChange: (chapter: string) => void;
    selectedDifficulty: string;
    onDifficultyChange: (difficulty: string) => void;
    selectedType: string;
    onTypeChange: (type: string) => void;
    selectedGrade: string;
    onGradeChange: (grade: string) => void;
}

export const QuestionFilters: React.FC<QuestionFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedChapter,
    onChapterChange,
    selectedDifficulty,
    onDifficultyChange,
    selectedType,
    onTypeChange,
    selectedGrade,
    onGradeChange,
}) => {
    const chapterOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả chương' },
        { value: '1', label: 'Chương 1: Hàm số' },
        { value: '2', label: 'Chương 2: Đạo hàm' },
        { value: '3', label: 'Chương 3: Giới hạn' },
        { value: '4', label: 'Chương 4: Tích phân' },
        { value: '5', label: 'Chương 5: Hình học' },
    ];

    const difficultyOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả độ khó' },
        { value: 'TH', label: 'Thông hiểu' },
        { value: 'NB', label: 'Nhận biết' },
        { value: 'VD', label: 'Vận dụng' },
        { value: 'VDC', label: 'Vận dụng cao' },
    ];

    const typeOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả loại' },
        { value: 'SINGLE_CHOICE', label: 'Trắc nghiệm' },
        { value: 'TRUE_FALSE', label: 'Đúng/Sai' },
        { value: 'SHORT_ANSWER', label: 'Trả lời ngắn' },
    ];

    const gradeOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả khối' },
        { value: '10', label: 'Khối 10' },
        { value: '11', label: 'Khối 11' },
        { value: '12', label: 'Khối 12' },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Tìm kiếm câu hỏi..."
                />
                <Dropdown
                    options={chapterOptions}
                    value={selectedChapter}
                    onChange={onChapterChange}
                    placeholder="Chọn chương"
                />
                <Dropdown
                    options={difficultyOptions}
                    value={selectedDifficulty}
                    onChange={onDifficultyChange}
                    placeholder="Chọn độ khó"
                />
                <Dropdown
                    options={typeOptions}
                    value={selectedType}
                    onChange={onTypeChange}
                    placeholder="Chọn loại"
                />
                <Dropdown
                    options={gradeOptions}
                    value={selectedGrade}
                    onChange={onGradeChange}
                    placeholder="Chọn khối"
                />
            </div>
        </Card>
    );
};
