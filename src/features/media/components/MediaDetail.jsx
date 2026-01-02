import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Download } from 'lucide-react';
import { Button } from '../../../shared/components/ui';
import { Spinner } from '../../../shared/components/loading/Loading';
import { MediaPreview } from './MediaPreview';
import { MediaInfo } from './MediaInfo';
import {
    selectCurrentMedia,
    selectMediaLoadingGetById,
    selectMediaLoadingDownloadUrl,
    getMediaDownloadUrlAsync,
    clearCurrentMedia,
} from '../store/mediaSlice';

export const MediaDetail = ({ mediaId, onClose, onDelete, loadingDelete }) => {
    const dispatch = useDispatch();
    const media = useSelector(selectCurrentMedia);
    const loading = useSelector(selectMediaLoadingGetById);
    const loadingDownload = useSelector(selectMediaLoadingDownloadUrl);

    useEffect(() => {
        return () => {
            // Cleanup when unmounting
            dispatch(clearCurrentMedia());
        };
    }, [dispatch]);

    const handleDownload = async (mediaId) => {
        try {
            const result = await dispatch(getMediaDownloadUrlAsync({ id: mediaId })).unwrap();
            if (result?.data?.downloadUrl) {
                // Create temporary link and trigger download
                const link = document.createElement('a');
                link.href = result.data.downloadUrl;
                link.download = result.data.filename || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error downloading media:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="xl" className="mx-auto mb-4" />
            </div>
        );
    }

    if (!media) return null;

    return (
        <div className="h-full flex flex-col">

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Preview */}
                <div className="flex justify-center items-center">
                    <MediaPreview media={media} onDownload={handleDownload} />
                </div>

                {/* Info */}
                <MediaInfo media={media} />
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-border">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Đóng
                    </Button>
                    {media.status === 'READY' && (
                        <Button
                            variant="primary"
                            onClick={() => handleDownload(media.mediaId)}
                            loading={loadingDownload}
                            disabled={loadingDownload}
                        >
                            <Download size={16} />
                            Tải xuống
                        </Button>
                    )}
                    {media.status !== 'DELETED' && (
                        <Button
                            variant="danger"
                            onClick={() => onDelete(media.mediaId)}
                            loading={loadingDelete}
                            disabled={loadingDelete}
                        >
                            <Trash2 size={16} />
                            Xóa
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
