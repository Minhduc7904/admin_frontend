// src/features/course/components/LessonDetail.jsx
import { Edit, Trash2, BookOpen, Calendar, User } from 'lucide-react'
import { Button } from '../../../shared/components'

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

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            {lesson.title}
                        </h2>
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

                {/* Description */}
                {lesson.description && (
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground-light uppercase">
                            Mô tả
                        </label>
                        <p className="text-sm text-foreground leading-relaxed">
                            {lesson.description}
                        </p>
                    </div>
                )}

                {/* Learning Items Count */}
                <div className="bg-info/5 border border-info/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-info" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                                {lesson.learningItemsCount || 0} tài liệu học tập
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Có {lesson.learningItemsCount || 0} nội dung được thêm vào bài học này
                            </p>
                        </div>
                    </div>
                </div>

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
