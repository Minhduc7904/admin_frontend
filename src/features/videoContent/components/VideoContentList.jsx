// src/features/course/components/VideoContentList.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Video, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '../../../shared/components'
import {
    getAllVideoContentsAsync,
    selectVideoContents,
    selectVideoContentLoadingGet,
} from '../../videoContent/store/videoContentSlice'
import { MediaGridItem } from '../../media/components/mediaPicker/MediaGridItem'

export const VideoContentList = ({ learningItemId, onAdd, onEdit, onDelete }) => {
    const dispatch = useDispatch()
    const videos = useSelector(selectVideoContents) || []
    const loading = useSelector(selectVideoContentLoadingGet)

    useEffect(() => {
        if (learningItemId) {
            dispatch(getAllVideoContentsAsync({ learningItemId }))
        }
    }, [learningItemId, dispatch])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Video className="w-5 h-5 text-blue-600" />
                    Video ({videos.length})
                </h3>
                <Button size="sm" variant="outline" onClick={onAdd}>
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm video
                </Button>
            </div>

            {videos.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Video className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-muted-foreground">
                        Chưa có video nào
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {Array.isArray(videos) && videos.map((video) => (
                        <div
                            key={video.videoContentId}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Video className="w-4 h-4 text-blue-600" />
                                        <h4 className="font-medium text-foreground">
                                            Video #{video.videoContentId}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {video.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button size="sm" variant="ghost" onClick={() => onEdit?.(video)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:bg-red-50"
                                        onClick={() => onDelete?.(video)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Media Files Grid */}
                            {video.mediaFiles && video.mediaFiles.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        File video ({video.mediaFiles.length})
                                    </p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {video.mediaFiles.map((media) => (
                                            <MediaGridItem
                                                key={media.mediaId}
                                                media={{
                                                    ...media,
                                                    fileName: media.filename,
                                                    originalName: media.filename,
                                                }}
                                                viewUrl={media.viewUrl}
                                                isSelected={false}
                                                onClick={() => {
                                                    if (media.viewUrl) {
                                                        window.open(media.viewUrl, '_blank')
                                                    }
                                                }}
                                                multiple={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
