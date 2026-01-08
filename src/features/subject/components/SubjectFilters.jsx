import { Search } from 'lucide-react';
import { Input } from '../../../shared/components/ui';

export const SubjectFilters = ({ search, onSearchChange }) => {
    return (
        <div className="flex gap-4">
            {/* Search Input */}
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder="Tìm kiếm môn học theo tên hoặc mã..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    icon={<Search size={16} />}
                />
            </div>
        </div>
    );
};
