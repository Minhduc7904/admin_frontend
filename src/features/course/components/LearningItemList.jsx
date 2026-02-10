// src/features/course/components/LearningItemList.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getAllLessonLearningItemsAsync,
    selectLessonLearningItems,
    selectLessonLearningItemLoadingGet,
    resetFilters,
    updateLocalOrder,
    reorderLessonLearningItemsAsync,
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
    
    // Drag & Drop state
    const [draggedIndex, setDraggedIndex] = useState(null)
    const [dragOverIndex, setDragOverIndex] = useState(null)

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

    // Drag handlers - only triggered from GripVertical
    const handleDragStart = (e, index, item) => {
        e.stopPropagation()
        setDraggedIndex(index)
        
        // Create custom ghost element with icon
        const ghost = document.createElement('div')
        ghost.className = 'flex items-center gap-2 bg-white border-2 border-primary px-3 py-2 rounded-lg shadow-lg'
        ghost.style.position = 'absolute'
        ghost.style.top = '-1000px'
        
        const learningItem = item.learningItem
        const type = learningItem?.type || 'DOCUMENT'
        const colorClass = LEARNING_ITEM_COLORS[type] || 'text-gray-600 bg-gray-50'
        
        // Icon container
        const iconContainer = document.createElement('div')
        iconContainer.className = `w-6 h-6 rounded flex items-center justify-center ${colorClass}`
        
        // Create SVG icon based on type
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('width', '14')
        svg.setAttribute('height', '14')
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('fill', 'none')
        svg.setAttribute('stroke', 'currentColor')
        svg.setAttribute('stroke-width', '2')
        svg.setAttribute('stroke-linecap', 'round')
        svg.setAttribute('stroke-linejoin', 'round')
        
        // Add paths based on type (simplified lucide-react icons)
        if (type === 'VIDEO') {
            // Video camera icon
            svg.innerHTML = '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>'
        } else if (type === 'YOUTUBE') {
            // Play circle icon
            svg.innerHTML = '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>'
        } else if (type === 'HOMEWORK') {
            // File check icon
            svg.innerHTML = '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>'
        } else {
            // Document icon (FileText)
            svg.innerHTML = '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'
        }
        
        iconContainer.appendChild(svg)
        
        // Title text
        const titleText = document.createElement('span')
        titleText.className = 'text-sm font-medium text-gray-900'
        titleText.textContent = learningItem?.title || 'Untitled'
        titleText.style.maxWidth = '200px'
        titleText.style.overflow = 'hidden'
        titleText.style.textOverflow = 'ellipsis'
        titleText.style.whiteSpace = 'nowrap'
        
        ghost.appendChild(iconContainer)
        ghost.appendChild(titleText)
        document.body.appendChild(ghost)
        
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setDragImage(ghost, 0, 0)
        
        setTimeout(() => document.body.removeChild(ghost), 0)
    }

    const handleDragOver = (e, index) => {
        e.preventDefault()
        e.stopPropagation()
        if (draggedIndex === null) {
            return
        }
        
        // Update drag over index if different from current
        if (dragOverIndex !== index) {
            setDragOverIndex(index)
        }
    }

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null)
            setDragOverIndex(null)
            return
        }

        // Reorder array
        const reorderedItems = [...learningItems]
        const [draggedItem] = reorderedItems.splice(draggedIndex, 1)
        reorderedItems.splice(dropIndex, 0, draggedItem)

        // Build items array with new orders (1-based)
        const items = reorderedItems.map((item, index) => ({
            learningItemId: item.learningItemId,
            order: index + 1
        }))

        // Update local state optimistically
        dispatch(updateLocalOrder({
            lessonId,
            items
        }))

        // Call API
        try {
            await dispatch(reorderLessonLearningItemsAsync({
                lessonId,
                items
            })).unwrap()
        } catch (error) {
            // Reload on error to revert
            dispatch(getAllLessonLearningItemsAsync({
                lessonId,
                page: 1,
                limit: 100,
            }))
        }

        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

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
            {learningItems.map((item, index) => {
                const learningItem = item.learningItem
                const Icon =
                    LEARNING_ITEM_ICONS[learningItem?.type] || FileText
                const colorClass =
                    LEARNING_ITEM_COLORS[learningItem?.type] ||
                    'text-gray-600 bg-gray-50'

                const isSelected =
                    selectedItem?.type === 'learningItem' && selectedItem?.data?.learningItemId === item.learningItemId
                
                const isDragging = draggedIndex === index
                const isDragOver = dragOverIndex === index && draggedIndex !== index

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
                            ${isDragging ? 'opacity-50' : ''}
                            ${isDragOver ? 'border-t-2 border-info' : ''}
                        `}
                        style={{ paddingLeft: indent + 8 }}
                        onClick={() => onSelectLearningItem?.(item, lesson)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        {/* Drag handle */}
                        <div
                            className="
                                group
                                cursor-grab
                                active:cursor-grabbing
                                text-muted-foreground/30
                                hover:text-muted-foreground/60
                                p-1 hover:bg-gray-200 rounded
                            "
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, index, item)}
                            onDragEnd={handleDragEnd}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <GripVertical size={14} />
                        </div>

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
