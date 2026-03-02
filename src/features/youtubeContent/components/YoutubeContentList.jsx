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
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600" />
                    YouTube ({youtubeVideos.length})
                </h3>
                <Button size="sm" variant="outline" onClick={onAdd} className="h-7 text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Thêm YouTube
                </Button>
            </div>

            {youtubeVideos.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <Youtube className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-muted-foreground">
                        Chưa có video YouTube nào
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {Array.isArray(youtubeVideos) && youtubeVideos.map((video) => (
                        <div
                            key={video.youtubeContentId}
                            className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Youtube className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                        <h4 className="text-sm font-medium text-foreground truncate">
                                            YouTube #{video.youtubeContentId}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                                        {video.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <Button size="sm" variant="ghost" onClick={() => onEdit?.(video)} className="">
                                        <Edit className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className=" text-red-500 hover:bg-red-50"
                                        onClick={() => onDelete?.(video)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
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
