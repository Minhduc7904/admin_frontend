import { useState, useEffect } from 'react';
import { getMyViewUrlAsync, selectMediaLoadingViewUrl } from '../store/mediaSlice';
import { ImagePreview, VideoPreview, AudioPreview, DocumentPreview } from './previews';
import { useSelector, useDispatch } from 'react-redux';

export const MediaPreview = ({ media, onDownload, loadViewUrl, loading }) => {
    const [viewUrl, setViewUrl] = useState(null);

    useEffect(() => {
        // console.log('Media changed:', media);
        if (media && (media.type === 'IMAGE' || media.type === 'VIDEO' || media.type === 'AUDIO' || media.type === 'DOCUMENT' || media.type === 'OTHER')) {
            const url = loadViewUrl?.(media);
            setViewUrl(url);
        }
    }, [media]);

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
