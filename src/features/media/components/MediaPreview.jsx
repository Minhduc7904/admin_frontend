import { useState, useEffect } from 'react';
import { mediaApi } from '../../../core/api/mediaApi';
import { ImagePreview, VideoPreview, AudioPreview, DocumentPreview } from './previews';

export const MediaPreview = ({ media, onDownload }) => {
    const [viewUrl, setViewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (media && (media.type === 'IMAGE' || media.type === 'VIDEO' || media.type === 'AUDIO' || media.type === 'DOCUMENT' || media.type === 'OTHER')) {
            loadViewUrl();
        }
    }, [media]);

    const loadViewUrl = async () => {
        if (!media) return;

        try {
            setLoading(true);
            const response = await mediaApi.getViewUrl(media.mediaId);
            if (response.data?.data?.viewUrl) {
                setViewUrl(response.data.data.viewUrl);
            }
        } catch (error) {
            console.error('Error loading view URL:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageError = (e) => {
        e.target.src = '';
        e.target.alt = 'Không thể tải ảnh';
    };

    if (!media) return null;

    const handleOpenInNewTab = () => {
        if (viewUrl) {
            window.open(viewUrl, '_blank');
        }
    };

    return (
        <div className="mb-6 max-w-64">
            {media.type === 'IMAGE' && (
                <ImagePreview
                    viewUrl={viewUrl}
                    loading={loading}
                    alt={media.alt || media.originalName}
                    onError={handleImageError}
                    onOpenInNewTab={handleOpenInNewTab}
                />
            )}

            {media.type === 'VIDEO' && (
                <VideoPreview
                    viewUrl={viewUrl}
                    loading={loading}
                    onOpenInNewTab={handleOpenInNewTab}
                />
            )}

            {media.type === 'AUDIO' && (
                <AudioPreview
                    viewUrl={viewUrl}
                    loading={loading}
                    filename={media.originalName}
                    onOpenInNewTab={handleOpenInNewTab}
                />
            )}

            {media.type === 'DOCUMENT' && (
                <DocumentPreview
                    media={media}
                    onDownload={onDownload}
                    onOpenInNewTab={handleOpenInNewTab}
                />
            )}

            {media.type === 'OTHER' && (
                <DocumentPreview
                    media={media}
                    onDownload={onDownload}
                    onOpenInNewTab={handleOpenInNewTab}
                />
            )}
        </div>
    );
};
