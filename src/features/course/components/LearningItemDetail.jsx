// src/features/course/components/LearningItemDetail.jsx
import { Edit, Trash2, Calendar, FileText, Video, Youtube, FileCheck, Hash, Info } from 'lucide-react'
import { Button } from '../../../shared/components'
import { DocumentContentList } from '../../documentContent/components/DocumentContentList'
import { VideoContentList } from '../../videoContent/components/VideoContentList'
import { YoutubeContentList } from '../../youtubeContent/components/YoutubeContentList'
import { HomeworkContentList } from '../../homeworkContent/components/HomeworkContentList'
import { formatDateTime } from '../../../shared/utils'

const LEARNING_ITEM_TYPES = {
    VIDEO: { label: 'Video', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
    DOCUMENT: { label: 'Tài liệu', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    HOMEWORK: { label: 'Bài tập', icon: FileCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
    YOUTUBE: { label: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
}

export const LearningItemDetail = ({
    learningItem,
    lessonTitle,
    onEdit,
    onDelete,
    onAddContent,
    onEditContent,
    onDeleteContent,
}) => {
    if (!learningItem) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-center">Chọn một tài liệu để xem chi tiết</p>
            </div>
        )
    }

    const typeInfo = LEARNING_ITEM_TYPES[learningItem.learningItem?.type] || {
        label: 'Khác',
        icon: FileText,
        color: 'text-gray-600',
        bg: 'bg-gray-50',
    }
    const TypeIcon = typeInfo.icon

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="shrink-0 border-b border-border px-6 py-4 bg-white">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${typeInfo.bg}`}>
                                <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeInfo.bg} ${typeInfo.color}`}>
                                {typeInfo.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                #{learningItem.order ?? '?'}
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-foreground truncate">
                            {learningItem.learningItem?.title || 'Untitled'}
                        </h2>
                        {lessonTitle && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Bài: {lessonTitle}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit?.(learningItem)}
                            className=""
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className=" text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            onClick={() => onDelete?.(learningItem)}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Info Row */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDateTime(learningItem.learningItem?.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5" />
                        <span>Thứ tự: {learningItem.order ?? '?'}</span>
                    </div>
                </div>

                {/* Description */}
                {learningItem.learningItem?.description && (
                    <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
                        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground leading-relaxed">
                            {learningItem.learningItem.description}
                        </p>
                    </div>
                )}

                {/* Content List - Render based on type */}
                <div className="pt-4 border-t border-gray-100">
                    {learningItem.learningItem?.type === 'DOCUMENT' && (
                        <DocumentContentList
                            learningItemId={learningItem.learningItem.learningItemId}
                            onAdd={() => onAddContent?.('DOCUMENT')}
                            onEdit={(doc) => onEditContent?.('DOCUMENT', doc)}
                            onDelete={(doc) => onDeleteContent?.('DOCUMENT', doc)}
                        />
                    )}
                    {learningItem.learningItem?.type === 'VIDEO' && (
                        <VideoContentList
                            learningItemId={learningItem.learningItem.learningItemId}
                            onAdd={() => onAddContent?.('VIDEO')}
                            onEdit={(video) => onEditContent?.('VIDEO', video)}
                            onDelete={(video) => onDeleteContent?.('VIDEO', video)}
                        />
                    )}
                    {learningItem.learningItem?.type === 'YOUTUBE' && (
                        <YoutubeContentList
                            learningItemId={learningItem.learningItem.learningItemId}
                            onAdd={() => onAddContent?.('YOUTUBE')}
                            onEdit={(video) => onEditContent?.('YOUTUBE', video)}
                            onDelete={(video) => onDeleteContent?.('YOUTUBE', video)}
                        />
                    )}
                    {learningItem.learningItem?.type === 'HOMEWORK' && (
                        <HomeworkContentList
                            learningItemId={learningItem.learningItem.learningItemId}
                            onAdd={() => onAddContent?.('HOMEWORK')}
                            onEdit={(homework) => onEditContent?.('HOMEWORK', homework)}
                            onDelete={(homework) => onDeleteContent?.('HOMEWORK', homework)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
