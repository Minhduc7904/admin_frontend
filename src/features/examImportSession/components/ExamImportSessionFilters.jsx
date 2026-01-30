import { Search } from 'lucide-react'
import { Input } from '../../../shared/components/ui/Input'

export const ExamImportSessionFilters = ({
    search,
    onSearchChange,
}) => {
    return (
        <div className="bg-white border border-border rounded-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-light"
                        size={18}
                    />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm session..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
        </div>
    )
}
