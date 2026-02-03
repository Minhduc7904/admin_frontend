import { SearchInput, Dropdown } from '../../../shared/components/ui';
import { QUESTION_TYPE_OPTIONS, DIFFICULTY_OPTIONS } from '../../../core/constants/question-constants';
import { VISIBILITY_OPTIONS } from '../../../core/constants';
import { GRADE_OPTIONS } from '../../../core/constants/grade-constants';

export const QuestionFilters = ({
    search,
    onSearchChange,
    grade,
    onGradeChange,
    visibility,
    onVisibilityChange,
    difficulty,
    onDifficultyChange,
    type,
    onTypeChange,
    subjectId,
    onSubjectIdChange
}) => {
    const gradeOptions = [
        ...GRADE_OPTIONS
    ];

    const visibilityOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        ...VISIBILITY_OPTIONS
    ];

    const difficultyOptions = [
        { value: '', label: 'Tất cả độ khó' },
        ...DIFFICULTY_OPTIONS
    ];

    const typeOptions = [
        { value: '', label: 'Tất cả loại' },
        ...QUESTION_TYPE_OPTIONS
    ];

    return (
        <div className="mb-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={search}
                            onChange={onSearchChange}
                            placeholder="Tìm kiếm câu hỏi (nội dung, đáp án)..."
                        />
                    </div>
                    <div className="w-48">
                        <Dropdown
                            value={grade}
                            onChange={onGradeChange}
                            options={gradeOptions}
                            placeholder="Chọn khối"
                        />
                    </div>
                    <div className="w-48">
                        <Dropdown
                            value={difficulty}
                            onChange={onDifficultyChange}
                            options={difficultyOptions}
                            placeholder="Chọn độ khó"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-48">
                        <Dropdown
                            value={type}
                            onChange={onTypeChange}
                            options={typeOptions}
                            placeholder="Chọn loại"
                        />
                    </div>
                    <div className="w-48">
                        <Dropdown
                            value={visibility}
                            onChange={onVisibilityChange}
                            options={visibilityOptions}
                            placeholder="Chọn trạng thái"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
