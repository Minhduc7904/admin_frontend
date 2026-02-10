// src/features/youtubeContent/components/EditYoutubeContent.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, YoutubeInput, Textarea } from '../../../shared/components'
import {
    updateYoutubeContentAsync,
    selectYoutubeContentLoadingUpdate,
} from '../store/youtubeContentSlice'

export const EditYoutubeContent = ({ onClose, youtubeContent, onSuccess }) => {
    const dispatch = useDispatch()
    const loadingUpdate = useSelector(selectYoutubeContentLoadingUpdate)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        content: youtubeContent?.content || '',
        youtubeUrl: youtubeContent?.youtubeUrl || '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateForm = (formData) => {
        const errors = {}

        if (!formData.youtubeUrl?.trim()) {
            errors.youtubeUrl = 'URL YouTube không được để trống'
        } else {
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
            if (!youtubeRegex.test(formData.youtubeUrl.trim())) {
                errors.youtubeUrl = 'URL YouTube không hợp lệ'
            }
        }

        if (!formData.content?.trim()) {
            errors.content = 'Mô tả không được để trống'
        } else if (formData.content.trim().length < 10) {
            errors.content = 'Mô tả phải có ít nhất 10 ký tự'
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
            youtubeUrl: formData.youtubeUrl.trim(),
        }

        try {
            await dispatch(updateYoutubeContentAsync({
                id: youtubeContent.youtubeContentId,
                data
            })).unwrap()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error updating youtube content:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                <YoutubeInput
                    error={errors.youtubeUrl}
                    label="URL YouTube"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                />

                <Textarea
                    error={errors.content}
                    label="Mô tả nội dung"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Nhập mô tả về video..."
                    rows={6}
                    required
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
