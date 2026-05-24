import { Search } from 'lucide-react';
import { Input, Select } from '../../../shared/components/ui';
import {
    TEACHER_PROFILE_FEATURED_FILTER_OPTIONS,
    TEACHER_PROFILE_VISIBILITY_FILTER_OPTIONS,
} from '../constants/teacherProfile.constants';

export const TeacherProfileFilters = ({
    search,
    visibility,
    isFeatured,
    onSearchChange,
    onVisibilityChange,
    onFeaturedChange,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm theo tên, slug, chuyên môn, SEO..."
                icon={<Search size={16} />}
            />
            <Select
                name="visibility"
                value={visibility}
                onChange={(e) => onVisibilityChange(e.target.value)}
                options={TEACHER_PROFILE_VISIBILITY_FILTER_OPTIONS}
            />
            <Select
                name="isFeatured"
                value={isFeatured}
                onChange={(e) => onFeaturedChange(e.target.value)}
                options={TEACHER_PROFILE_FEATURED_FILTER_OPTIONS}
            />
        </div>
    );
};
