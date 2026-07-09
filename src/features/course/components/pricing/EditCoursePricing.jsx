import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Button } from '../../../../shared/components/ui'
import {
    updateCoursePricingAsync,
    getCourseByIdAsync,
    selectCourseLoadingUpdate,
} from '../../store/courseSlice'

export const EditCoursePricing = ({ course, onClose, disabled = false }) => {
    const dispatch = useDispatch()
    const loadingUpdate = useSelector(selectCourseLoadingUpdate)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        priceVND: '',
        compareAtVND: '',
    })

    useEffect(() => {
        if (!course) return

        setFormData({
            priceVND: course.priceVND?.toString() ?? '',
            compareAtVND: course.compareAtVND?.toString() ?? '',
        })
    }, [course])

    const handleInputChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const errors = {}

        const price = parseFloat(formData.priceVND)
        if (isNaN(price) || price < 0) {
            errors.priceVND = 'Giá bán phải là số không âm'
        }

        if (formData.compareAtVND) {
            const compare = parseFloat(formData.compareAtVND)
            if (isNaN(compare) || compare < 0) {
                errors.compareAtVND = 'Giá gốc phải là số không âm'
            } else if (compare <= price) {
                errors.compareAtVND = 'Giá gốc phải lớn hơn giá bán'
            }
        }

        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const data = {
            priceVND: parseFloat(formData.priceVND),
            compareAtVND: formData.compareAtVND
                ? parseFloat(formData.compareAtVND)
                : undefined,
        }

        try {
            await dispatch(
                updateCoursePricingAsync({ id: course.courseId, data }),
            ).unwrap()

            await dispatch(getCourseByIdAsync(course.courseId))
            onClose()
        } catch (error) {
            console.error('Error updating course pricing:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                <Input
                    name="priceVND"
                    label="Giá bán (VNĐ)"
                    type="number"
                    required
                    value={formData.priceVND}
                    onChange={handleInputChange}
                    error={errors.priceVND}
                    disabled={disabled}
                    min={0}
                />

                <Input
                    name="compareAtVND"
                    label="Giá gốc (VNĐ)"
                    type="number"
                    value={formData.compareAtVND}
                    onChange={handleInputChange}
                    error={errors.compareAtVND}
                    disabled={disabled}
                    min={0}
                    helperText="Để trống nếu không giảm giá"
                />
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button type="submit" loading={loadingUpdate} disabled={disabled}>
                    Cập nhật
                </Button>
            </div>
        </form>
    )
}
