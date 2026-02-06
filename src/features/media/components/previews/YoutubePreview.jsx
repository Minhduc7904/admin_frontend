/**
 * YoutubePreview Component
 * Hiển thị YouTube video embed inline
 */
export const YoutubePreview = ({ youtubeUrl }) => {
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

    if (!videoId) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">
                    URL YouTube không hợp lệ
                </p>
                <p className="text-xs text-red-500 mt-1 break-all">
                    {youtubeUrl}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="relative w-full rounded-lg overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline break-all block"
            >
                {youtubeUrl}
            </a>
        </div>
    );
};

export default YoutubePreview;
