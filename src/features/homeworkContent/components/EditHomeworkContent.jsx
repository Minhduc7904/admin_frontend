// src/features/homeworkContent/components/EditHomeworkContent.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Textarea, Checkbox } from '../../../shared/components'
import { CompetitionSearchSelect } from '../../competition/components'
import { toVNDateTimeLocal, vnDateTimeLocalToISO } from '../../../shared/utils'
import {
    updateHomeworkContentAsync,
    selectHomeworkContentLoadingUpdate,
} from '../store/homeworkContentSlice'

export const EditHomeworkContent = ({ onClose, homeworkContent, onSuccess }) => {
    const dispatch = useDispatch()
    const loadingUpdate = useSelector(selectHomeworkContentLoadingUpdate)
    const [errors, setErrors] = useState({})


    const getInitialCompetition = () => {
        if (homeworkContent?.competition) return homeworkContent.competition
        if (homeworkContent?.competitionId) {
            return {
                competitionId: homeworkContent.competitionId,
                title: homeworkContent.competitionTitle || `#${homeworkContent.competitionId}`,
            }
        }
        return null
    }

    const [formData, setFormData] = useState({
        content: homeworkContent?.content || '',
        dueDate: toVNDateTimeLocal(homeworkContent?.dueDate),
        competition: getInitialCompetition(),
        allowLateSubmit: homeworkContent?.allowLateSubmit || false,
        updatePointsOnLateSubmit: homeworkContent?.updatePointsOnLateSubmit || false,
        updatePointsOnReSubmit: homeworkContent?.updatePointsOnReSubmit || false,
        updateMaxPoints: homeworkContent?.updateMaxPoints || false,
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCheckboxChange = (name, checked) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }))
    }

    const validateForm = (formData) => {
        const errors = {}

        if (!formData.content?.trim()) {
            errors.content = 'Nội dung không được để trống'
        } else if (formData.content.trim().length < 10) {
            errors.content = 'Nội dung phải có ít nhất 10 ký tự'
        }

        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateForm(formData)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const data = {
            content: formData.content.trim(),
            ...(formData.dueDate && { dueDate: vnDateTimeLocalToISO(formData.dueDate) }),
            ...(formData.competition && { competitionId: formData.competition.competitionId }),
            allowLateSubmit: formData.allowLateSubmit,
            updatePointsOnLateSubmit: formData.updatePointsOnLateSubmit,
            updatePointsOnReSubmit: formData.updatePointsOnReSubmit,
            updateMaxPoints: formData.updateMaxPoints,
        }

        try {
            await dispatch(updateHomeworkContentAsync({
                id: homeworkContent.homeworkContentId,
                data
            })).unwrap()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error updating homework content:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                <Textarea
                    error={errors.content}
                    label="Nội dung bài tập"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết về bài tập..."
                    rows={8}
                    required
                />

                <Input
                    error={errors.dueDate}
                    type="datetime-local"
                    label="Hạn nộp"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                />

                <CompetitionSearchSelect
                    label="Cuộc thi (tùy chọn)"
                    placeholder="Tìm kiếm cuộc thi..."
                    value={formData.competition}
                    onSelect={(competition) => setFormData(prev => ({ ...prev, competition }))}
                    error={errors.competition}
                />

                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="allowLateSubmit"
                            name="allowLateSubmit"
                            checked={formData.allowLateSubmit}
                            onChange={(checked) => handleCheckboxChange('allowLateSubmit', checked)}
                        />
                        <label htmlFor="allowLateSubmit" className="flex-1 cursor-pointer">
                            <span className="text-sm font-medium text-foreground block mb-1">
                                Cho phép nộp muộn
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Học sinh có thể nộp bài sau thời hạn
                            </span>
                        </label>
                    </div>

                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="updatePointsOnLateSubmit"
                            name="updatePointsOnLateSubmit"
                            checked={formData.updatePointsOnLateSubmit}
                            onChange={(checked) => handleCheckboxChange('updatePointsOnLateSubmit', checked)}
                        />
                        <label htmlFor="updatePointsOnLateSubmit" className="flex-1 cursor-pointer">
                            <span className="text-sm font-medium text-foreground block mb-1">
                                Cập nhật điểm khi nộp muộn
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Có cập nhật điểm nếu học sinh nộp muộn không
                            </span>
                        </label>
                    </div>

                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="updatePointsOnReSubmit"
                            name="updatePointsOnReSubmit"
                            checked={formData.updatePointsOnReSubmit}
                            onChange={(checked) => handleCheckboxChange('updatePointsOnReSubmit', checked)}
                        />
                        <label htmlFor="updatePointsOnReSubmit" className="flex-1 cursor-pointer">
                            <span className="text-sm font-medium text-foreground block mb-1">
                                Cập nhật điểm khi nộp lại
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Có cập nhật điểm nếu học sinh nộp lại bài không
                            </span>
                        </label>
                    </div>

                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="updateMaxPoints"
                            name="updateMaxPoints"
                            checked={formData.updateMaxPoints}
                            onChange={(checked) => handleCheckboxChange('updateMaxPoints', checked)}
                        />
                        <label htmlFor="updateMaxPoints" className="flex-1 cursor-pointer">
                            <span className="text-sm font-medium text-foreground block mb-1">
                                Chỉ cập nhật khi điểm cao hơn
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Nếu cập nhật điểm thì chỉ cập nhật khi điểm mới cao hơn điểm cũ
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loadingUpdate}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loadingUpdate}
                    disabled={loadingUpdate}
                >
                    Cập nhật
                </Button>
            </div>
        </form>
    )
}
