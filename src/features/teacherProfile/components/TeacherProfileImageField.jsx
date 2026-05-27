import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const TeacherProfileImageField = ({
    value,
    imageUrl,
    onOpen,
    onClear,
    error,
}) => {
    const hasImage = Boolean(value || imageUrl);

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Ảnh đại diện</label>
            <div className={`rounded-sm border p-3 ${error ? 'border-red-500' : 'border-border'}`}>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Ảnh đại diện giáo viên"
                                className="h-14 w-14 rounded-sm border border-border object-cover"
                            />
                        ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-gray-50">
                                <ImageIcon size={20} className="text-foreground-light" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-foreground">
                                {value ? `Media #${value}` : 'Chưa chọn ảnh'}
                            </div>
                            <div className="text-xs text-foreground-light">
                                Chọn media ảnh cho profile giáo viên.
                            </div>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        {hasImage && (
                            <Button type="button" variant="outline" onClick={onClear}>
                                <X size={16} />
                                Bỏ chọn
                            </Button>
                        )}
                        <Button type="button" onClick={onOpen}>
                            <ImageIcon size={16} />
                            Chọn ảnh
                        </Button>
                    </div>
                </div>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};
