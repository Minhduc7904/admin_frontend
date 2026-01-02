import { SearchInput } from '../../../shared/components/ui';

export const RoleFilters = ({ search, onSearchChange }) => {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm vai trò..."
                    />
                </div>
            </div>
        </div>
    );
};
