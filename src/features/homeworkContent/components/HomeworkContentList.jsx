// src/features/course/components/HomeworkContentList.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileCheck, Plus, Edit, Trash2, Clock, CheckCircle } from 'lucide-react'
import { Button } from '../../../shared/components'
import {
    getAllHomeworkContentsAsync,
    selectHomeworkContents,
    selectHomeworkContentLoadingGet,
} from '../../homeworkContent/store/homeworkContentSlice'
import { formatDateTime } from '../../../shared/utils'

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-orange-600" />
                    Bài tập ({homeworks.length})
                </h3>
                <Button size="sm" variant="outline" onClick={onAdd}>
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm bài tập
                </Button>
            </div>

            {homeworks.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <FileCheck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-muted-foreground">
                        Chưa có bài tập nào
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {Array.isArray(homeworks) && homeworks.map((homework) => (
                        <div
                            key={homework.homeworkContentId}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileCheck className="w-4 h-4 text-orange-600" />
                                        <h4 className="font-medium text-foreground">
                                            {homework.title || 'Untitled Homework'}
                                        </h4>
                                    </div>
                                    {homework.description && (
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {homework.description}
                                        </p>
                                    )}
                                    <div className="space-y-2">
                                        {homework.dueDate && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    Hạn nộp: {formatDateTime(homework.dueDate)}
                                                </span>
                                            </div>
                                        )}
                                        {homework.maxScore && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    Điểm tối đa: {homework.maxScore}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button size="sm" variant="ghost" onClick={() => onEdit?.(homework)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:bg-red-50"
                                        onClick={() => onDelete?.(homework)}
                                    >
                                        <Trash2 className="w-4 h-4" />
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
