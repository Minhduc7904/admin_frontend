// src/features/course/components/LessonItem.jsx
import { useState } from 'react'
import {
    ChevronRight,
    ChevronDown,
    FileText,
    Plus,
    Edit,
    Trash2,
} from 'lucide-react'
import { LearningItemList } from './LearningItemList'

export const LessonItem = ({
    lesson,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    onAddLearningItem,
    selectedItem,
    onSelectLearningItem,
    onEditLearningItem,
    onDetachLearningItem,
    level = 0,
}) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const indent = level * 20

    const toggleExpand = (e) => {
        e.stopPropagation()
        setIsExpanded((prev) => !prev)
    }

    return (
        <div>
            {/* ===== Row ===== */}
            <div
                className={`
                    group flex items-center gap-2 px-2 py-1.5 rounded
                    cursor-pointer transition-colors text-sm
                    ${isSelected
                        ? 'bg-info/10 text-info font-medium'
                        : 'hover:bg-gray-50 text-foreground'
                    }
                `}
                style={{ paddingLeft: indent + 8 }}
                onClick={() => onSelect?.(lesson.lessonId)}
            >
                {/* Toggle */}
                <button
                    onClick={toggleExpand}
                    className="p-0.5 hover:bg-gray-200 rounded"
                >
                    {isExpanded ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </button>

                {/* Icon */}
                <FileText
                    size={16}
                    className={isSelected ? 'text-info' : 'text-gray-500'}
                />

                {/* Title */}
                <span className="flex-1 truncate">
                    {lesson.title}
                </span>

                {/* Learning items count */}
                {typeof lesson.learningItemsCount === 'number' && (
                    <span className="text-xs text-foreground-light tabular-nums">
                        {lesson.learningItemsCount}
                    </span>
                )}

                {/* Actions */}
                <div
                    className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => onAddLearningItem?.(lesson)}
                        className="p-1 hover:bg-green-100 rounded text-green-600"
                        title="Thêm nội dung"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => onEdit?.(lesson)}
                        className="p-1 hover:bg-blue-100 rounded text-blue-600"
                        title="Sửa bài học"
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => onDelete?.(lesson)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Xoá bài học"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* ===== Children ===== */}
            {isExpanded && (
                <div className="mt-0.5">
                    <LearningItemList
                        lessonId={lesson.lessonId}
                        lesson={lesson}
                        level={level + 1}
                        onEdit={onEditLearningItem}
                        onDelete={(item) => onDetachLearningItem?.(item, lesson.lessonId)}
                        selectedItem={selectedItem}
                        onSelectLearningItem={onSelectLearningItem}
                    />
                </div>
            )}
        </div>
    )
}
