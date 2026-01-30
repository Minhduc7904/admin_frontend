import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { createExamImportSessionAsync, selectExamImportSessionLoadingCreate } from '../store/examImportSessionSlice'

export const AddExamImportSession = ({ onClose, loadSessions }) => {
    const dispatch = useDispatch()
    const loadingCreate = useSelector(selectExamImportSessionLoadingCreate)

    const [formData, setFormData] = useState({
        description: '',
    })

    const [errors, setErrors] = useState({})

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.description?.trim()) {
            newErrors.description = 'Mô tả không được để trống'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) return

        try {
            await dispatch(
                createExamImportSessionAsync({
                    description: formData.description.trim(),
                })
            ).unwrap()

            loadSessions()
            onClose()
        } catch (err) {
            console.error('Create exam import session failed:', err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Mô tả <span className="text-danger">*</span>
                </label>
                <Input
                    type="text"
                    placeholder="Nhập mô tả session..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                />
                {errors.description && (
                    <p className="text-sm text-danger mt-1">{errors.description}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loadingCreate}
                    className="flex-1"
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={loadingCreate}
                    className="flex-1"
                >
                    Tạo Session
                </Button>
            </div>
        </form>
    )
}
