import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '../../../shared/components';
import {
    getMyViewUrlAsync,
    selectMediaLoadingViewUrl,
} from '../../media/store/mediaSlice';
import { DocumentPreview } from '../../media/components/previews/DocumentPreview';
import { ImagePreview } from '../../media/components/previews/ImagePreview';
import { VideoPreview } from '../../media/components/previews/VideoPreview';

export const MediaPreviewPanel = ({ media, onClose }) => {
    const dispatch = useDispatch();
    const loadingViewUrl = useSelector(selectMediaLoadingViewUrl);
    
    const [viewUrl, setViewUrl] = useState(null);

    useEffect(() => {
        const fetchViewUrl = async () => {
            if (media?.mediaId) {
                const result = await dispatch(getMyViewUrlAsync({
                    id: media.mediaId,
                    expiry: 3600,
                }));
                
                if (result.type.endsWith('/fulfilled') && result.payload?.data?.viewUrl) {
                    setViewUrl(result.payload.data.viewUrl);
                }
            }
        };

        fetchViewUrl();
        
        return () => {
            setViewUrl(null);
        };
    }, [media?.mediaId, dispatch]);

    if (!media) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
                <p className="text-foreground-light">Chọn một file để xem trước</p>
            </div>
        );
    }

    const renderPreview = () => {
        if (loadingViewUrl) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <RefreshCw className="animate-spin mb-2 text-info" size={32} />
                    <p className="text-sm text-foreground-light">Đang tải...</p>
                </div>
            );
        }

        if (media.type === 'IMAGE') {
            return (
                <ImagePreview
                    viewUrl={viewUrl}
                    alt={media.name}
                    onOpenInNewTab={() => window.open(viewUrl, '_blank')}
                />
            );
        }

        if (media.type === 'VIDEO') {
            return (
                <VideoPreview
                    viewUrl={viewUrl}
                    onOpenInNewTab={() => window.open(viewUrl, '_blank')}
                />
            );
        }

        if (media.type === 'DOCUMENT') {
            return (
                <DocumentPreview
                    media={media}
                    viewUrl={viewUrl}
                    onDownload={() => window.open(viewUrl, '_blank')}
                    onOpenInNewTab={() => window.open(viewUrl, '_blank')}
                />
            );
        }

        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-foreground-light">Không hỗ trợ xem trước loại file này</p>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                        {media.originalName || media.name}
                    </h3>
                    <p className="text-sm text-foreground-light">
                        {media.type} • {media.mimeType}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {renderPreview()}
            </div>
        </div>
    );
};
