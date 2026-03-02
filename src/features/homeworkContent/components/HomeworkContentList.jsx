// src/features/course/components/HomeworkContentList.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileCheck, Plus, Edit, Trash2, Clock, CheckCircle, RefreshCw, ArrowUp, TimerOff } from 'lucide-react'
import { Button } from '../../../shared/components'
import {
    getAllHomeworkContentsAsync,
    selectHomeworkContents,
    selectHomeworkContentLoadingGet,
} from '../../homeworkContent/store/homeworkContentSlice'
import { formatDateTime } from '../../../shared/utils'

const BooleanBadge = ({ value, icon: Icon, label }) => {
    if (!value) return null
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            <Icon className="w-3 h-3" />
            {label}
        </span>
    )
}

export const HomeworkContentList = ({ learningItemId, onAdd, onEdit, onDelete }) => {
    const dispatch = useDispatch()
    const homeworks = useSelector(selectHomeworkContents) || []
    const loading = useSelector(selectHomeworkContentLoadingGet)

    useEffect(() => {
        if (learningItemId) {
            dispatch(getAllHomeworkContentsAsync({ learningItemId }))
        }
    }, [learningItemId, dispatch])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-orange-600" />
                    Bài tập ({homeworks.length})
                </h3>
                <Button size="sm" variant="outline" onClick={onAdd} className="h-7 text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Thêm bài tập
                </Button>
            </div>

            {homeworks.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FileCheck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-muted-foreground">
                        Chưa có bài tập nào
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {Array.isArray(homeworks) && homeworks.map((homework) => (
                        <div
                            key={homework.homeworkContentId}
                            className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground line-clamp-2 mb-2">
                                        {homework.content || 'Untitled Homework'}
                                    </p>

                                    {/* Metadata row */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {homework.dueDate && (
                                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {formatDateTime(homework.dueDate)}
                                            </span>
                                        )}
                                        <BooleanBadge value={homework.allowLateSubmit} icon={TimerOff} label="Nộp muộn" />
                                        <BooleanBadge value={homework.updatePointsOnLateSubmit} icon={Clock} label="Điểm nộp muộn" />
                                        <BooleanBadge value={homework.updatePointsOnReSubmit} icon={RefreshCw} label="Điểm nộp lại" />
                                        <BooleanBadge value={homework.updateMaxPoints} icon={ArrowUp} label="Chỉ điểm cao hơn" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <Button size="sm" variant="ghost" onClick={() => onEdit?.(homework)} className="p-0">
                                        <Edit className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className=" text-red-500 hover:bg-red-50"
                                        onClick={() => onDelete?.(homework)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
