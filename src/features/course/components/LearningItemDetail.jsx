// src/features/course/components/LearningItemDetail.jsx
import { useState } from 'react'
import { Edit, Trash2, Calendar, FileText, Video, Youtube, FileCheck, Hash, Info, Link2, Copy, Check } from 'lucide-react'
import { Button, QrCodeShare } from '../../../shared/components'
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
    courseId,
    lessonId,
    learningItem,
    lessonTitle,
    onEdit,
    onDelete,
    onAddContent,
    onEditContent,
    onDeleteContent,
}) => {
    const [copiedHomeworkLink, setCopiedHomeworkLink] = useState(false)

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
    const learningItemId = learningItem.learningItem?.learningItemId || learningItem.learningItemId
    const isHomework = learningItem.learningItem?.type === 'HOMEWORK'
    const homeworkLink = (courseId && lessonId && learningItemId)
        ? `https://beeedu.vn/student/courses/${courseId}/lessons/${lessonId}/learning-items/${learningItemId}`
        : ''

    const handleCopyHomeworkLink = async () => {
        if (!homeworkLink) return
        try {
            await navigator.clipboard.writeText(homeworkLink)
            setCopiedHomeworkLink(true)
            setTimeout(() => setCopiedHomeworkLink(false), 1800)
        } catch (error) {
            console.error('Copy homework link failed:', error)
        }
    }

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

                {isHomework && homeworkLink && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-border space-y-3">
                        <div className="flex items-center gap-2">
                            <Link2 className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">Link làm bài tập về nhà</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <a
                                href={homeworkLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-900 hover:underline break-all"
                            >
                                {homeworkLink}
                            </a>
                            <button
                                type="button"
                                onClick={handleCopyHomeworkLink}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-border bg-white hover:bg-gray-100 transition-colors"
                                title="Sao chép link"
                            >
                                {copiedHomeworkLink ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                {copiedHomeworkLink ? 'Đã sao chép' : 'Sao chép link'}
                            </button>
                        </div>

                        <QrCodeShare link={homeworkLink} />
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
