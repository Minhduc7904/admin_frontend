import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const TeacherProfileScheduleImagesField = ({
    label = 'Ảnh lịch dạy',
    emptyTitle = 'Chưa chọn ảnh lịch dạy',
    helperText = 'Có thể chọn nhiều ảnh từ media library.',
    altPrefix = 'Ảnh lịch dạy',
    mediaIds = [],
    imageUrls = [],
    onOpen,
    onClear,
    error,
}) => {
    const hasImages = mediaIds.length > 0 || imageUrls.length > 0;

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
            <div className={`rounded-sm border p-3 ${error ? 'border-red-500' : 'border-border'}`}>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-3">
                        {hasImages ? (
                            <>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {imageUrls.map((url, index) => (
                                        <img
                                            key={`${url}-${index}`}
                                            src={url}
                                            alt={`${altPrefix} ${index + 1}`}
                                            className="aspect-video w-full rounded-sm border border-border object-cover"
                                        />
                                    ))}
                                    {imageUrls.length === 0 &&
                                        mediaIds.map((mediaId) => (
                                            <div
                                                key={mediaId}
                                                className="flex aspect-video items-center justify-center rounded-sm border border-border bg-gray-50 text-sm font-medium text-foreground-light"
                                            >
                                                Media #{mediaId}
                                            </div>
                                        ))}
                                </div>
                                {mediaIds.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {mediaIds.map((mediaId) => (
                                            <span
                                                key={mediaId}
                                                className="rounded-full border border-border bg-gray-50 px-2.5 py-1 text-xs font-medium text-foreground-light"
                                            >
                                                #{mediaId}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gray-50">
                                    <ImageIcon size={18} className="text-foreground-light" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground">{emptyTitle}</div>
                                    <div className="text-xs text-foreground-light">{helperText}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                        {hasImages && (
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
