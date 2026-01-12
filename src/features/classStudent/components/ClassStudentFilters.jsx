import { SearchInput } from '../../../shared/components/ui';

export const ClassStudentFilters = ({
    search,
    onSearchChange,
}) => {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm học sinh (tên, email, mã học sinh)..."
                    />
                </div>
            </div>
        </div>
    );
};
