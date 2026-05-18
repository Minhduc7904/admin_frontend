import { Search } from 'lucide-react';
import { Input, Select } from '../../../shared/components/ui';
import {
    DOCUMENT_FEATURED_FILTER_OPTIONS,
    DOCUMENT_VISIBILITY_FILTER_OPTIONS,
} from '../constants/document.constants';

export const DocumentFilters = ({
    search,
    visibility,
    isFeatured,
    tagId,
    onSearchChange,
    onVisibilityChange,
    onFeaturedChange,
    onTagIdChange,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm theo tiêu đề hoặc slug..."
                icon={<Search size={16} />}
            />
            <Select
                name="visibility"
                value={visibility}
                onChange={(e) => onVisibilityChange(e.target.value)}
                options={DOCUMENT_VISIBILITY_FILTER_OPTIONS}
            />
            <Select
                name="isFeatured"
                value={isFeatured}
                onChange={(e) => onFeaturedChange(e.target.value)}
                options={DOCUMENT_FEATURED_FILTER_OPTIONS}
            />
            <Input
                type="number"
                value={tagId}
                onChange={(e) => onTagIdChange(e.target.value)}
                placeholder="Lọc theo tag ID"
                min="1"
            />
        </div>
    );
};
