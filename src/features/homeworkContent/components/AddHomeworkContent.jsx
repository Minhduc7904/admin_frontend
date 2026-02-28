// src/features/homeworkContent/components/AddHomeworkContent.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Textarea, Checkbox } from '../../../shared/components'
import { CompetitionSearchSelect } from '../../competition/components'
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
        competition: null,
        allowLateSubmit: false,
        maxPoints: '',
        pointsOnReSubmit: '',
        pointsOnLateSubmit: '',
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
            learningItemId: Number(learningItemId),
            content: formData.content.trim(),
            ...(formData.dueDate && { dueDate: new Date(formData.dueDate).toISOString() }),
            ...(formData.competition && { competitionId: formData.competition.competitionId }),
            allowLateSubmit: formData.allowLateSubmit,
            ...(formData.maxPoints !== '' && { maxPoints: Number(formData.maxPoints) }),
            ...(formData.pointsOnReSubmit !== '' && { pointsOnReSubmit: Number(formData.pointsOnReSubmit) }),
            ...(formData.pointsOnLateSubmit !== '' && { pointsOnLateSubmit: Number(formData.pointsOnLateSubmit) }),
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
