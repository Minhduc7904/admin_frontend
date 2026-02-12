// src/features/homeworkContent/components/EditHomeworkContent.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Textarea, Checkbox } from '../../../shared/components'
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


    const [formData, setFormData] = useState({
        content: homeworkContent?.content || '',
        dueDate: formatDateForInput(homeworkContent?.dueDate) || '',
        competitionId: homeworkContent?.competitionId?.toString() || '',
        allowLateSubmit: homeworkContent?.allowLateSubmit || false,
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

        if (formData.competitionId) {
            const compId = parseInt(formData.competitionId)
            if (isNaN(compId) || compId < 1) {
                errors.competitionId = 'ID cuộc thi phải là số nguyên dương'
            }
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
            ...(formData.dueDate && { dueDate: new Date(formData.dueDate).toISOString() }),
            ...(formData.competitionId && { competitionId: Number(formData.competitionId) }),
            allowLateSubmit: formData.allowLateSubmit,
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

                <Input
                    error={errors.competitionId}
                    type="number"
                    label="ID Cuộc thi (tùy chọn)"
                    name="competitionId"
                    value={formData.competitionId}
                    onChange={handleChange}
                    placeholder="Nhập ID cuộc thi nếu có..."
                />

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
