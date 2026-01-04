import { SearchInput, Dropdown } from '../../../shared/components/ui';

export const StudentFilters = ({ search, onSearchChange, grade, onGradeChange, isActive, onIsActiveChange }) => {
    const gradeOptions = [
        { value: '', label: 'Tất cả khối' },
        { value: '1', label: 'Khối 1' },
        { value: '2', label: 'Khối 2' },
        { value: '3', label: 'Khối 3' },
        { value: '4', label: 'Khối 4' },
        { value: '5', label: 'Khối 5' },
        { value: '6', label: 'Khối 6' },
        { value: '7', label: 'Khối 7' },
        { value: '8', label: 'Khối 8' },
        { value: '9', label: 'Khối 9' },
        { value: '10', label: 'Khối 10' },
        { value: '11', label: 'Khối 11' },
        { value: '12', label: 'Khối 12' },
    ];

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm học sinh (username, email, tên)..."
                    />
                </div>
                <div className="w-64">
                    <Dropdown
                        value={grade}
                        onChange={onGradeChange}
                        options={gradeOptions}
                        placeholder="Chọn khối"
                    />
                </div>
                <div className="w-48">
                    <Dropdown
                        value={isActive}
                        onChange={onIsActiveChange}
                        options={[
                            { value: '', label: 'Tất cả trạng thái' },
                            { value: 'true', label: 'Đang hoạt động' },
                            { value: 'false', label: 'Đã vô hiệu hóa' },
                        ]}
                        placeholder="Chọn trạng thái"
                    />
                </div>
            </div>
        </div>
    );
}
