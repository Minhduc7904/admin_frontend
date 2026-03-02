// src/features/course/components/LessonDetail.jsx
import { Edit, Trash2, BookOpen, Calendar, User, Eye, EyeOff, FileText, Video, Youtube, FileCheck, Tag, Plus } from 'lucide-react'
import { Button } from '../../../shared/components'

const VISIBILITY_CONFIG = {
    DRAFT: {
        label: 'Bản nháp',
        className: 'bg-gray-100 text-gray-600',
        icon: EyeOff
    },
    PUBLISHED: {
        label: 'Đã xuất bản',
        className: 'bg-emerald-50 text-emerald-700',
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
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="shrink-0 border-b border-border px-6 py-4 bg-white">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h2 className="text-lg font-bold text-foreground truncate">
                                {lesson.title}
                            </h2>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${visibilityConfig.className}`}>
                                <VisibilityIcon className="w-3 h-3" />
                                {visibilityConfig.label}
                            </span>
                            {lesson.allowTrial && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                    <Eye className="w-3 h-3" />
                                    Học thử
                                </span>
                            )}
                        </div>
                        {lesson.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {lesson.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit?.(lesson)}
                            className="h-8 w-8 p-0"
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            onClick={() => onDelete?.(lesson)}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Tạo lúc</p>
                            <p className="text-sm text-foreground truncate">{formatDate(lesson.createdAt)}</p>
                        </div>
                    </div>

                    {lesson.teacherId && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Giáo viên</p>
                                <p className="text-sm text-foreground truncate">{lesson.teacherName || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chapters */}
                {lesson.chapters && lesson.chapters.length > 0 && (
                    <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-2">
                            <Tag className="w-3.5 h-3.5" />
                            Chương ({lesson.chapters.length})
                        </h3>
                        <div className="space-y-1.5">
                            {lesson.chapters.map((chapter) => (
                                <div key={chapter.chapterId} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                        #{chapter.orderInParent || '?'}
                                    </span>
                                    <span className="text-foreground flex-1 truncate">
                                        {chapter.name}
                                    </span>
                                    {chapter.code && (
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {chapter.code}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Learning Item */}
                <Button
                    onClick={() => onAddLearningItem?.(lesson)}
                    variant="outline"
                    className="w-full border-dashed"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm tài liệu học tập
                </Button>
            </div>
        </div>
    )
}
