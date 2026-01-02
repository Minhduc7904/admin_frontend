import { RefreshCw, ExternalLink } from 'lucide-react';

export const ImagePreview = ({ viewUrl, loading, alt, onError, onOpenInNewTab }) => {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-sm border border-border">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-info" size={24} />
                    <p className="text-sm text-foreground-light">Đang tải ảnh...</p>
                </div>
            </div>
        );
    }

    if (!viewUrl) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-sm border border-border">
                <p className="text-sm text-foreground-light">Không có ảnh xem trước</p>
            </div>
        );
    }

    return (
        <div className="relative group">
            <img
                src={viewUrl}
                alt={alt || 'Image preview'}
                className="w-full rounded-sm border border-border"
                onError={onError}
            />
            {onOpenInNewTab && (
                <button
                    onClick={onOpenInNewTab}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Mở trong tab mới"
                >
                    <ExternalLink size={16} />
                </button>
            )}
        </div>
    );
};
