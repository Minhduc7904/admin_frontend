import { SearchInput, Dropdown } from '../../../shared/components/ui';

export const PermissionFilters = ({ search, onSearchChange, group, onGroupChange, groups, loadingGroups }) => {
    const groupOptions = [
        { value: '', label: 'Tất cả nhóm' },
        ...groups.map(g => ({ value: g, label: g }))
    ];

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm quyền (code, name, description)..."
                    />
                </div>
                <div className="w-64">
                    <Dropdown
                        value={group}
                        onChange={onGroupChange}
                        options={groupOptions}
                        placeholder="Chọn nhóm"
                        disabled={loadingGroups}
                    />
                </div>
            </div>
        </div>
    );
};
