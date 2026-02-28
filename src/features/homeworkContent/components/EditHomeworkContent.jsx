// src/features/homeworkContent/components/EditHomeworkContent.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Textarea, Checkbox } from '../../../shared/components'
import { CompetitionSearchSelect } from '../../competition/components'
import {
    updateHomeworkContentAsync,
    selectHomeworkContentLoadingUpdate,
} from '../store/homeworkContentSlice'

export const EditHomeworkContent = ({ onClose, homeworkContent, onSuccess }) => {
    const dispatch = useDispatch()
    const loadingUpdate = useSelector(selectHomeworkContentLoadingUpdate)
    const [errors, setErrors] = useState({})

    const formatDateForInput = (dateString) => {
        if (!dateString) return ''

        const date = new Date(dateString)

        // Format datetime-local input theo giờ Việt Nam
        // Sử dụng locale 'sv-SE' để có format YYYY-MM-DD HH:mm
        const vnDateStr = date.toLocaleString('sv-SE', { 
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(' ', 'T')

        return vnDateStr
    }


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
        dueDate: formatDateForInput(homeworkContent?.dueDate) || '',
        competition: getInitialCompetition(),
        allowLateSubmit: homeworkContent?.allowLateSubmit || false,
        maxPoints: homeworkContent?.maxPoints ?? '',
        pointsOnReSubmit: homeworkContent?.pointsOnReSubmit ?? '',
        pointsOnLateSubmit: homeworkContent?.pointsOnLateSubmit ?? '',
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

    const validatePointField = (value, fieldName, errors) => {
        if (value === '' || value === null || value === undefined) return
        const num = Number(value)
        if (isNaN(num) || num < 0) {
            errors[fieldName] = 'Điểm phải là số không âm'
        }
    }

    const validateForm = (formData) => {
        const errors = {}

        if (!formData.content?.trim()) {
            errors.content = 'Nội dung không được để trống'
        } else if (formData.content.trim().length < 10) {
            errors.content = 'Nội dung phải có ít nhất 10 ký tự'
        }

        validatePointField(formData.maxPoints, 'maxPoints', errors)
        validatePointField(formData.pointsOnReSubmit, 'pointsOnReSubmit', errors)
        validatePointField(formData.pointsOnLateSubmit, 'pointsOnLateSubmit', errors)

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
            ...(formData.dueDate && { dueDate: new Date(formData.dueDate).toISOString() }),
            ...(formData.competition && { competitionId: formData.competition.competitionId }),
            allowLateSubmit: formData.allowLateSubmit,
            ...(formData.maxPoints !== '' && { maxPoints: Number(formData.maxPoints) }),
            ...(formData.pointsOnReSubmit !== '' && { pointsOnReSubmit: Number(formData.pointsOnReSubmit) }),
            ...(formData.pointsOnLateSubmit !== '' && { pointsOnLateSubmit: Number(formData.pointsOnLateSubmit) }),
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

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        error={errors.maxPoints}
                        label="Điểm tối đa"
                        name="maxPoints"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.maxPoints}
                        onChange={handleChange}
                        placeholder="VD: 10"
                    />
                    <Input
                        error={errors.pointsOnReSubmit}
                        label="Điểm khi nộp lại"
                        name="pointsOnReSubmit"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.pointsOnReSubmit}
                        onChange={handleChange}
                        placeholder="VD: 8"
                    />
                    <Input
                        error={errors.pointsOnLateSubmit}
                        label="Điểm khi nộp muộn"
                        name="pointsOnLateSubmit"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.pointsOnLateSubmit}
                        onChange={handleChange}
                        placeholder="VD: 5"
                    />
                </div>

                <Checkbox
                    label="Cho phép nộp muộn"
                    checked={formData.allowLateSubmit}
                    onChange={(checked) => handleCheckboxChange('allowLateSubmit', checked)}
                />
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
