// src/features/course/components/DocumentContentList.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileText, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '../../../shared/components'
import {
    getAllDocumentContentsAsync,
    selectDocumentContents,
    selectDocumentContentLoadingGet,
} from '../../documentContent/store/documentContentSlice'
import { MediaGridItem } from '../../media/components/mediaPicker/MediaGridItem'

export const DocumentContentList = ({ learningItemId, onAdd, onEdit, onDelete }) => {
    const dispatch = useDispatch()
    const documents = useSelector(selectDocumentContents) || []
    const loading = useSelector(selectDocumentContentLoadingGet)

    useEffect(() => {
        if (learningItemId) {
            dispatch(getAllDocumentContentsAsync({ learningItemId }))
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
                    <FileText className="w-5 h-5 text-green-600" />
                    Tài liệu ({documents.length})
                </h3>
                <Button size="sm" variant="outline" onClick={onAdd}>
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm tài liệu
                </Button>
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-muted-foreground">
                        Chưa có tài liệu nào
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {Array.isArray(documents) && documents.map((doc) => (
                        <div
                            key={doc.documentContentId}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-green-600" />
                                        <h4 className="font-medium text-foreground">
                                            Tài liệu #{doc.orderInDocument || doc.documentContentId}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {doc.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button size="sm" variant="ghost" onClick={() => onEdit?.(doc)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:bg-red-50"
                                        onClick={() => onDelete?.(doc)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Media Files Grid */}
                            {doc.mediaFiles && doc.mediaFiles.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        File đính kèm ({doc.mediaFiles.length})
                                    </p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {doc.mediaFiles.map((media) => (
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
