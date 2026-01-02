import { RefreshCw, Music, ExternalLink } from 'lucide-react';

export const AudioPreview = ({ viewUrl, loading, filename, onOpenInNewTab }) => {
    if (loading) {
        return (
            <div className="w-full p-6 flex items-center justify-center bg-gray-50 rounded-sm border border-border">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-info" size={24} />
                    <p className="text-sm text-foreground-light">Đang tải audio...</p>
                </div>
            </div>
        );
    }

    if (!viewUrl) {
        return (
            <div className="w-full p-6 flex items-center justify-center bg-gray-50 rounded-sm border border-border">
                <div className="text-center">
                    <Music className="mx-auto mb-2 text-foreground-light" size={48} />
                    <p className="text-sm text-foreground-light">Không có audio xem trước</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group w-full p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-sm border border-border">
            {onOpenInNewTab && (
                <button
                    onClick={onOpenInNewTab}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Mở trong tab mới"
                >
                    <ExternalLink size={16} />
                </button>
            )}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-sm flex items-center justify-center shadow-sm">
                    <Music className="text-purple-600" size={32} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{filename || 'Audio file'}</p>
                    <p className="text-xs text-foreground-light">Audio Player</p>
                </div>
            </div>
            <audio
                controls
                className="w-full"
                src={viewUrl}
                preload="metadata"
            >
                <p className="text-sm text-foreground-light">Trình duyệt không hỗ trợ audio</p>
            </audio>
        </div>
    );
};
