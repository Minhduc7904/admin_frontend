import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '../../../../shared/components/ui';

export const DocumentPreview = ({ media, viewUrl, onDownload, onOpenInNewTab }) => {
    const getDocumentIcon = (mimeType) => {
        if (mimeType?.includes('pdf')) return '📄';
        if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
        if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return '📊';
        if (mimeType?.includes('powerpoint') || mimeType?.includes('presentation')) return '📽️';
        if (mimeType?.includes('zip') || mimeType?.includes('compressed')) return '📦';
        return '📁';
    };

    const isPDF = media?.mimeType?.includes('pdf');

    // If PDF and viewUrl available, show PDF viewer
    if (isPDF && viewUrl) {
        return (
            <div className="relative group w-full h-full flex flex-col bg-white rounded-sm border border-border">
                {onOpenInNewTab && (
                    <button
                        onClick={onOpenInNewTab}
                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Mở trong tab mới"
                    >
                        <ExternalLink size={16} />
                    </button>
                )}
                <div className="flex-1 min-h-0">
                    <iframe
                        src={viewUrl}
                        className="w-full h-full border-0"
                        title={media.originalName || 'PDF Preview'}
                    />
                </div>
            </div>
        );
    }

    // For non-PDF documents or when viewUrl is not available
    return (
        <div className="relative group w-full p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-sm border border-border">
            {onOpenInNewTab && (
                <button
                    onClick={onOpenInNewTab}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Mở trong tab mới"
                >
                    <ExternalLink size={16} />
                </button>
            )}
            <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-sm flex items-center justify-center shadow-md mx-auto mb-4">
                    <span className="text-6xl">{getDocumentIcon(media.mimeType)}</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1 break-all">
                    {media.originalName}
                </h3>
                <p className="text-sm text-foreground-light mb-1">
                    {media.mimeType}
                </p>
                <p className="text-xs text-foreground-light mb-4">
                    Document • {media.type}
                </p>
                {onDownload && (
                    <Button
                        variant="primary"
                        onClick={() => onDownload(media.mediaId)}
                        className="mt-2"
                    >
                        <Download size={16} />
                        Tải xuống để xem
                    </Button>
                )}
            </div>
        </div>
    );
};
