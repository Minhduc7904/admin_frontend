// src/features/course/components/YoutubeContentList.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Youtube, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '../../../shared/components'
import {
    getAllYoutubeContentsAsync,
    selectYoutubeContents,
    selectYoutubeContentLoadingGet,
} from '../../youtubeContent/store/youtubeContentSlice'
import { YoutubePreview } from '../../media/components/previews/YoutubePreview'

export const YoutubeContentList = ({ learningItemId, onAdd, onEdit, onDelete }) => {
    const dispatch = useDispatch()
    const youtubeVideos = useSelector(selectYoutubeContents) || []
    const loading = useSelector(selectYoutubeContentLoadingGet)

    useEffect(() => {
        if (learningItemId) {
            dispatch(getAllYoutubeContentsAsync({ learningItemId }))
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
                    <Youtube className="w-5 h-5 text-red-600" />
                    YouTube ({youtubeVideos.length})
                </h3>
                <Button size="sm" variant="outline" onClick={onAdd}>
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm video YouTube
                </Button>
            </div>

            {youtubeVideos.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Youtube className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-muted-foreground">
                        Chưa có video YouTube nào
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {Array.isArray(youtubeVideos) && youtubeVideos.map((video) => (
                        <div
                            key={video.youtubeContentId}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Youtube className="w-4 h-4 text-red-600" />
                                        <h4 className="font-medium text-foreground">
                                            YouTube #{video.youtubeContentId}
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

                            {/* YouTube Preview */}
                            {video.content && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <YoutubePreview youtubeUrl={video.youtubeUrl} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
