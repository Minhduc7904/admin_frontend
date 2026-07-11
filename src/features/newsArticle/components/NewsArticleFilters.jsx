import { Search } from 'lucide-react';
import { Input, Select } from '../../../shared/components/ui';
import {
    NEWS_ARTICLE_FEATURED_FILTER_OPTIONS,
    NEWS_ARTICLE_TYPE_OPTIONS,
    NEWS_ARTICLE_VISIBILITY_FILTER_OPTIONS,
} from '../constants/newsArticle.constants';

export const NewsArticleFilters = ({ filters, search, onSearchChange, onFilterChange }) => (
    <div className="grid grid-cols-1 gap-3 rounded-sm border border-border bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
        <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm tiêu đề, slug, tác giả…"
            icon={<Search size={16} />}
        />
        <Select
            name="type"
            value={filters.type}
            onChange={(event) => onFilterChange({ type: event.target.value })}
            options={[{ value: '', label: 'Tất cả loại bài viết' }, ...NEWS_ARTICLE_TYPE_OPTIONS]}
        />
        <Select
            name="visibility"
            value={filters.visibility}
            onChange={(event) => onFilterChange({ visibility: event.target.value })}
            options={NEWS_ARTICLE_VISIBILITY_FILTER_OPTIONS}
        />
        <Select
            name="isFeatured"
            value={filters.isFeatured}
            onChange={(event) => onFilterChange({ isFeatured: event.target.value })}
            options={NEWS_ARTICLE_FEATURED_FILTER_OPTIONS}
        />
    </div>
);
