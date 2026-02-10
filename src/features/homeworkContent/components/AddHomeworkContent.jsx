// src/features/homeworkContent/components/AddHomeworkContent.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Textarea, Checkbox } from '../../../shared/components'
import {
    createHomeworkContentAsync,
    selectHomeworkContentLoadingCreate,
} from '../store/homeworkContentSlice'

export const AddHomeworkContent = ({ onClose, learningItemId, onSuccess }) => {
    const dispatch = useDispatch()
    const loadingCreate = useSelector(selectHomeworkContentLoadingCreate)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        content: '',
        dueDate: '',
        competitionId: '',
        allowLateSubmit: false,
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

        if (formData.dueDate) {
            const dueDate = new Date(formData.dueDate)
            const now = new Date()
            if (dueDate < now) {
                errors.dueDate = 'Hạn nộp phải là thời điểm trong tương lai'
            }
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
            learningItemId: Number(learningItemId),
            content: formData.content.trim(),
            ...(formData.dueDate && { dueDate: new Date(formData.dueDate).toISOString() }),
            ...(formData.competitionId && { competitionId: Number(formData.competitionId) }),
            allowLateSubmit: formData.allowLateSubmit,
        }

        try {
            await dispatch(createHomeworkContentAsync(data)).unwrap()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error creating homework content:', error)
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
                    rows={6}
                    required
                />

                <Input
                    error={errors.dueDate}
                    label="Hạn nộp"
                    name="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={handleChange}
                />

                <Input
                    error={errors.competitionId}
                    label="ID Cuộc thi"
                    name="competitionId"
                    type="number"
                    value={formData.competitionId}
                    onChange={handleChange}
                    placeholder="Để trống nếu không liên quan đến cuộc thi"
                />

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
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
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loadingCreate}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={loadingCreate}
                >
                    Tạo bài tập
                </Button>
            </div>
        </form>
    )
}
