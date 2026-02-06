import { X } from 'lucide-react';
import { Modal, Spinner } from '../../../shared/components';
import { ImagePreview, VideoPreview, DocumentPreview } from './previews';
import { YoutubePreview } from './previews/YoutubePreview';

export const MediaPreviewModal = ({ isOpen, onClose, media, youtubeUrl, loading = false }) => {
    if (!isOpen) return null;

    const handleOpenInNewTab = () => {
        if (youtubeUrl) {
            window.open(youtubeUrl, '_blank');
        } else if (media?.url) {
            window.open(media.url, '_blank');
        }
    };

    const renderPreview = () => {
        // Show loading state
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center p-12 gap-3">
                    <Spinner size="lg" />
                    <p className="text-sm text-foreground-light">Đang tải...</p>
                </div>
            );
        }

        // YouTube preview
        if (youtubeUrl) {
            return <YoutubePreview youtubeUrl={youtubeUrl} />;
        }

        if (!media) {
            return (
                <div className="p-8 text-center text-foreground-light">
                    Không có nội dung để xem trước
                </div>
            );
        }

        // Determine media type from mimeType
        const mimeType = media.mimeType || '';
        const mediaType = media.type || '';

        // Image preview
        if (mimeType.startsWith('image/') || mediaType === 'IMAGE') {
            return (
                <ImagePreview
                    viewUrl={media.url}
                    alt={media.originalName}
                    onOpenInNewTab={handleOpenInNewTab}
                />
            );
        }

        // Video preview
        if (mimeType.startsWith('video/') || mediaType === 'VIDEO') {
            return (
                <VideoPreview
                    viewUrl={media.url}
                    onOpenInNewTab={handleOpenInNewTab}
                />
            );
        }

        // Document preview
        if (
            mimeType.includes('pdf') ||
            mimeType.includes('document') ||
            mimeType.includes('word') ||
            mimeType.includes('excel') ||
            mimeType.includes('powerpoint') ||
            mimeType.includes('text') ||
            mediaType === 'DOCUMENT'
        ) {
            return (
                <DocumentPreview
                    media={media}
                    viewUrl={media.url}
                    onOpenInNewTab={handleOpenInNewTab}
                />
            );
        }

        // Fallback for unknown types
        return (
            <div className="p-8 text-center">
                <p className="text-foreground-light mb-4">
                    Không thể xem trước loại file này
                </p>
                <button
                    onClick={handleOpenInNewTab}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                    Mở trong tab mới
                </button>
            </div>
        );
    };

    const getTitle = () => {
        if (youtubeUrl) return 'Video YouTube';
        return media?.originalName || media?.name || 'Xem trước';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={getTitle()}
            size="xl"
        >
            <div className="h-[80vh] overflow-auto">
                {renderPreview()}
            </div>
        </Modal>
    );
};
