import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Button, Dropdown, Checkbox } from '../../../../shared/components/ui'
import {
    updateCoursePricingAsync,
    getCourseByIdAsync,
    selectCourseLoadingUpdate,
} from '../../store/courseSlice'
import { PAYMENT_TYPES, PAYMENT_TYPE_OPTIONS } from '../../constanst/payment-type.constants'

export const EditCoursePricing = ({ course, onClose, disabled = false }) => {
    const dispatch = useDispatch()
    const loadingUpdate = useSelector(selectCourseLoadingUpdate)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        priceVND: '',
        compareAtVND: '',
        hasTuitionFee: true,
        paymentType: PAYMENT_TYPES.MONTHLY,
        autoRenew: false,
        blockUnpaid: false,
        gracePeriodDays: '',
    })

    useEffect(() => {
        if (!course) return

        setFormData({
            priceVND: course.priceVND?.toString() ?? '',
            compareAtVND: course.compareAtVND?.toString() ?? '',
            hasTuitionFee: course.hasTuitionFee ?? true,
            paymentType: course.paymentType ?? 'MONTHLY',
            autoRenew: course.autoRenew ?? false,
            blockUnpaid: course.blockUnpaid ?? false,
            gracePeriodDays:
                course.gracePeriodDays !== null && course.gracePeriodDays !== undefined
                    ? course.gracePeriodDays.toString()
                    : '',
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

        if (formData.gracePeriodDays && parseInt(formData.gracePeriodDays) < 0) {
            errors.gracePeriodDays = 'Số ngày ân hạn phải ≥ 0'
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
            hasTuitionFee: formData.hasTuitionFee,
            paymentType: formData.paymentType,
            autoRenew: formData.autoRenew,
            blockUnpaid: formData.blockUnpaid,
            gracePeriodDays: formData.gracePeriodDays
                ? parseInt(formData.gracePeriodDays)
                : null,
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

                <Dropdown
                    label="Hình thức thanh toán"
                    value={formData.paymentType}
                    onChange={(value) =>
                        setFormData((prev) => ({ ...prev, paymentType: value }))
                    }
                    options={PAYMENT_TYPE_OPTIONS}
                    disabled={disabled}
                />

                {/* ✅ CHECKBOX AREA */}
                <div className="space-y-3">
                    <Checkbox
                        id="autoRenew"
                        checked={formData.autoRenew}
                        onChange={(checked) =>
                            setFormData((prev) => ({ ...prev, autoRenew: checked }))
                        }
                        label="Tự động gia hạn"
                        className={disabled ? 'opacity-50 pointer-events-none' : ''}
                    />

                    <Checkbox
                        id="blockUnpaid"
                        checked={formData.blockUnpaid}
                        onChange={(checked) =>
                            setFormData((prev) => ({ ...prev, blockUnpaid: checked }))
                        }
                        label="Chặn học khi chưa đóng học phí"
                        className={disabled ? 'opacity-50 pointer-events-none' : ''}
                    />
                </div>

                <Input
                    name="gracePeriodDays"
                    label="Số ngày ân hạn"
                    type="number"
                    value={formData.gracePeriodDays}
                    onChange={handleInputChange}
                    error={errors.gracePeriodDays}
                    disabled={disabled}
                    min={0}
                    helperText="Số ngày cho phép học sau khi hết hạn thanh toán"
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
