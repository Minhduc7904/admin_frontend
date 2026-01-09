import { SearchInput, Dropdown } from '../../../shared/components/ui';

export const ChapterFilters = ({
    search,
    onSearchChange,
    selectedSubjectId,
    onSubjectChange,
    subjects,
    loadingSubjects,
}) => {
    const subjectOptions = [
        { value: '', label: 'Tất cả môn học' },
        ...subjects.map(subject => ({
            value: subject.subjectId,
            label: subject.name
        }))
    ];

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm chương (name, slug, code)..."
                    />
                </div>

                {/* Subject filter */}
                <div className="w-64">
                    <Dropdown
                        value={selectedSubjectId || ''}
                        onChange={onSubjectChange}
                        options={subjectOptions}
                        placeholder="Chọn môn học"
                        disabled={loadingSubjects}
                    />
                </div>
            </div>
        </div>
    );
};
