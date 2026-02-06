import { Upload } from 'lucide-react';
import { Button, InlineLoading } from '../../../shared/components';

export const MediaUploadSection = ({
    title,
    fieldName,
    mediaType,
    items = [],
    loading = false,
    disabled = false,
    emptyMessage = 'Chưa có file',
    gridLayout = false,
    onUploadClick,
    renderItem,
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground-light">
                    {title}
                </label>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUploadClick(fieldName, mediaType)}
                    disabled={disabled}
                >
                    <Upload className="w-4 h-4" />
                    Tải lên
                </Button>
            </div>
            <div className={gridLayout ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
                {loading ? (
                    <div className={gridLayout ? 'col-span-2' : ''}>
                        <InlineLoading message="Đang tải..." />
                    </div>
                ) : items.length > 0 ? (
                    items.map(renderItem)
                ) : (
                    <div className={`text-sm text-foreground-light ${gridLayout ? 'col-span-2' : ''}`}>
                        {emptyMessage}
                    </div>
                )}
            </div>
        </div>
    );
};
