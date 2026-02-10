// src/features/course/components/LearningItemDetail.jsx
import { Edit, Trash2, Calendar, FileText, Video, Youtube, FileCheck } from 'lucide-react'
import { Button } from '../../../shared/components'
import { DocumentContentList } from '../../documentContent/components/DocumentContentList'
import { VideoContentList } from '../../videoContent/components/VideoContentList'
import { YoutubeContentList } from '../../youtubeContent/components/YoutubeContentList'
import { HomeworkContentList } from '../../homeworkContent/components/HomeworkContentList'

const LEARNING_ITEM_TYPES = {
    VIDEO: { label: 'Video', icon: Video, color: 'text-blue-600' },
    DOCUMENT: { label: 'Tài liệu', icon: FileText, color: 'text-green-600' },
    HOMEWORK: { label: 'Bài tập', icon: FileCheck, color: 'text-orange-600' },
    YOUTUBE: { label: 'YouTube', icon: Youtube, color: 'text-red-600' },
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
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
    }
    const TypeIcon = typeInfo.icon

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`${typeInfo.color}`}>
                                <TypeIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground-light uppercase">
                                    {typeInfo.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    #{learningItem.order ?? '?'}
                                </p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-1">
                            {learningItem.learningItem?.title || 'Untitled'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Bài: {lessonTitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit?.(learningItem)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => onDelete?.(learningItem)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground-light uppercase">
                            Loại
                        </label>
                        <p className="text-sm text-foreground font-medium">
                            {typeInfo.label}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground-light uppercase">
                            Thứ tự
                        </label>
                        <p className="text-sm text-foreground font-medium">
                            #{learningItem.order ?? '?'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground-light uppercase">
                            Tạo lúc
                        </label>
                        <div className="flex items-center gap-2 text-sm text-foreground">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {formatDate(learningItem.learningItem?.createdAt)}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground-light uppercase">
                            Trạng thái
                        </label>
                        <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            Hoạt động
                        </div>
                    </div>
                </div>

                {/* Description */}
                {learningItem.learningItem?.description && (
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground-light uppercase">
                            Mô tả
                        </label>
                        <p className="text-sm text-foreground leading-relaxed">
                            {learningItem.learningItem.description}
                        </p>
                    </div>
                )}

                {/* Content List - Render based on type */}
                <div className="pt-6 border-t border-gray-200">
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
