import React from 'react';
import { SearchInput } from '@/shared/components/ui';

interface PermissionsFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const PermissionsFilters: React.FC<PermissionsFiltersProps> = ({
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="flex gap-3">
            <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Tìm kiếm quyền..."
                className="flex-1"
            />
        </div>
    );
};
