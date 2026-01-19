// src/features/course/components/LearningItemList.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getAllLessonLearningItemsAsync,
    selectLessonLearningItems,
    selectLessonLearningItemLoadingGet,
    resetFilters,
} from '../../lessonLearningitem/store/lessonLearningItemSlice'
import {
    FileText,
    Video,
    Youtube,
    FileCheck,
    Loader2,
    GripVertical,
    Edit,
    Trash2,
} from 'lucide-react'

const LEARNING_ITEM_ICONS = {
    VIDEO: Video,
    DOCUMENT: FileText,
    HOMEWORK: FileCheck,
    YOUTUBE: Youtube,
}

const LEARNING_ITEM_COLORS = {
    VIDEO: 'text-blue-600 bg-blue-50',
    DOCUMENT: 'text-green-600 bg-green-50',
    HOMEWORK: 'text-orange-600 bg-orange-50',
    YOUTUBE: 'text-red-600 bg-red-50',
}

export const LearningItemList = ({
    lessonId,
    lesson,
    level = 1,
    selectedItem,
    onSelect,
    onEdit,
    onDelete,
    onSelectLearningItem,
}) => {
    const dispatch = useDispatch()
    const learningItems = useSelector(selectLessonLearningItems(lessonId))
    const loading = useSelector(selectLessonLearningItemLoadingGet(lessonId))

    const indent = level * 20

    useEffect(() => {
        if (lessonId) {
            dispatch(
                getAllLessonLearningItemsAsync({
                    lessonId,
                    page: 1,
                    limit: 100,
                }),
            )
        }

        return () => {
            dispatch(resetFilters())
        }
    }, [dispatch, lessonId])

    if (loading) {
        return (
            <div className="px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Đang tải nội dung…
            </div>
        )
    }

    if (!learningItems.length) {
        return (
            <div
                className="px-2 py-1.5 text-xs text-muted-foreground italic"
                style={{ paddingLeft: indent + 32 }}
            >
                Chưa có tài liệu học tập
            </div>
        )
    }

    return (
        <div className="space-y-0.5">
            {learningItems.map((item) => {
                const learningItem = item.learningItem
                const Icon =
                    LEARNING_ITEM_ICONS[learningItem?.type] || FileText
                const colorClass =
                    LEARNING_ITEM_COLORS[learningItem?.type] ||
                    'text-gray-600 bg-gray-50'

                const isSelected =
                    selectedItem?.type === 'learningItem' && selectedItem?.data?.learningItemId === item.learningItemId

                return (
                    <div
                        key={item.learningItemId}
                        className={`
                            group flex items-center gap-2 px-2 py-1.5 rounded
                            cursor-pointer transition-colors text-sm
                            ${selectedItem?.type === 'learningItem' && selectedItem?.data?.learningItemId === item.learningItemId
                                ? 'bg-info/10 text-info font-medium'
                                : 'hover:bg-gray-50 text-foreground'
                            }
                        `}
                        style={{ paddingLeft: indent + 8 }}
                        onClick={() => onSelectLearningItem?.(item, lesson)}
                    >
                        {/* Drag handle (visual only for now) */}
                        <GripVertical
                            size={14}
                            className="text-muted-foreground/30 group-hover:text-muted-foreground/60"
                        />

                        {/* Icon */}
                        <div
                            className={`w-6 h-6 rounded flex items-center justify-center ${colorClass}`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                        </div>

                        {/* Title */}
                        <span className="flex-1 truncate">
                            {learningItem?.title || 'Untitled'}
                        </span>

                        {/* Order */}
                        <span className="text-xs text-foreground-light tabular-nums">
                            #{item.order ?? '?'}
                        </span>

                        {/* Actions */}
                        <div
                            className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => onEdit?.(item)}
                                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                title="Chỉnh sửa"
                            >
                                <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                                onClick={() => onDelete?.(item)}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                                title="Xoá"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
