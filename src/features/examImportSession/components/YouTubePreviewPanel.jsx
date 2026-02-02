import { X } from 'lucide-react';
import { Button } from '../../../shared/components';

/**
 * YouTubePreviewPanel Component
 * Hiển thị YouTube video embed player
 */
export const YouTubePreviewPanel = ({ youtubeUrl, onClose }) => {
    // Extract video ID from various YouTube URL formats
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        
        // Handle different YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    };

    const videoId = getYouTubeVideoId(youtubeUrl);

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                    Video hướng dẫn giải
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Video Player */}
            <div className="flex-1 p-4 overflow-y-auto">
                {videoId ? (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-foreground-light mb-2">
                                URL YouTube không hợp lệ
                            </p>
                            <p className="text-sm text-foreground-lighter">
                                {youtubeUrl}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* URL Info */}
            <div className="p-4 border-t border-border">
                <p className="text-sm text-foreground-light mb-1">
                    Link YouTube:
                </p>
                <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground hover:underline break-all"
                >
                    {youtubeUrl}
                </a>
            </div>
        </div>
    );
};

export default YouTubePreviewPanel;
