// src/features/course/components/LessonDetail.jsx
import { Edit, Trash2, BookOpen, Calendar, User, Eye, EyeOff, FileText, Video, Youtube, FileCheck, Tag } from 'lucide-react'
import { Button } from '../../../shared/components'

const VISIBILITY_CONFIG = {
    DRAFT: {
        label: 'Bản nháp',
        className: 'bg-gray-100 text-gray-700',
        icon: EyeOff
    },
    PUBLISHED: {
        label: 'Đã xuất bản',
        className: 'bg-green-100 text-green-700',
        icon: Eye
    }
}

const LEARNING_ITEM_ICONS = {
    VIDEO: Video,
    DOCUMENT: FileText,
    HOMEWORK: FileCheck,
    YOUTUBE: Youtube,
}

const LEARNING_ITEM_COLORS = {
    VIDEO: 'text-blue-600',
    DOCUMENT: 'text-green-600',
    HOMEWORK: 'text-orange-600',
    YOUTUBE: 'text-red-600',
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

export const LessonDetail = ({
    lesson,
    onEdit,
    onDelete,
    onAddLearningItem,
}) => {
    if (!lesson) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-center">Chọn một bài học để xem chi tiết</p>
            </div>
        )
    }

    const visibilityConfig = VISIBILITY_CONFIG[lesson.visibility] || VISIBILITY_CONFIG.DRAFT
    const VisibilityIcon = visibilityConfig.icon

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-2xl font-bold text-foreground">
                                {lesson.title}
                            </h2>
                            {/* Visibility Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${visibilityConfig.className}`}>
                                <VisibilityIcon className="w-3.5 h-3.5" />
                                {visibilityConfig.label}
                            </span>
                            {/* Trial Badge */}
                            {lesson.allowTrial && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    <Eye className="w-3.5 h-3.5" />
                                    Học thử
                                </span>
                            )}
                        </div>
                        {lesson.description && (
                            <p className="text-sm text-muted-foreground">
                                {lesson.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit?.(lesson)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => onDelete?.(lesson)}
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
                            Tạo lúc
                        </label>
                        <div className="flex items-center gap-2 text-sm text-foreground">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {formatDate(lesson.createdAt)}
                        </div>
                    </div>

                    {lesson.teacherId && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground-light uppercase">
                                Giáo viên
                            </label>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <User className="w-4 h-4 text-muted-foreground" />
                                {lesson.teacherName || 'N/A'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Chapters */}
                {lesson.chapters && lesson.chapters.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground-light uppercase flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5" />
                            Chương ({lesson.chapters.length})
                        </label>
                        <div className="space-y-2">
                            {lesson.chapters.map((chapter) => (
                                <div key={chapter.chapterId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <span className="text-xs font-medium text-primary">
                                        #{chapter.orderInParent || '?'}
                                    </span>
                                    <span className="text-sm text-foreground flex-1">
                                        {chapter.name}
                                    </span>
                                    {chapter.code && (
                                        <span className="text-xs text-muted-foreground">
                                            {chapter.code}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Add Learning Item Button */}
                <Button
                    onClick={() => onAddLearningItem?.(lesson)}
                    className="w-full"
                >
                    Thêm tài liệu học tập
                </Button>
            </div>
        </div>
    )
}
