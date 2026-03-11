import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Dropdown, Textarea, CurrencyInput } from '../../../shared/components/ui'
import { TUITION_PAYMENT_STATUS_OPTIONS, MONTH_OPTIONS, YEAR_OPTIONS } from '../constants/tuition-payment.constant'
import {
    updateTuitionPaymentAsync,
    selectTuitionPaymentLoadingUpdate,
} from '../store/tuitionPaymentSlice'
import { formatDate } from '../../../shared/utils/dateTime'
export const EditTuitionPayment = ({ payment, onClose, onSuccess }) => {
    const dispatch = useDispatch()
    const loading = useSelector(selectTuitionPaymentLoadingUpdate)
    // console.log('Payment data in EditTuitionPayment:', payment)
    const [formData, setFormData] = useState({
        amount: payment.amount,
        month: payment.month,
        year: payment.year,
        status: payment.status,
        paidAt: payment.paidAt
            ? new Date(payment.paidAt).toLocaleDateString('en-CA', {
                timeZone: 'Asia/Ho_Chi_Minh'
            })
            : '',
        notes: payment.notes || '',
    })
    // console.log('Initial formData:', formData)

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.month) {
            newErrors.month = 'Vui lòng chọn tháng'
        }

        if (!formData.year) {
            newErrors.year = 'Vui lòng chọn năm'
        }

        if (!formData.status) {
            newErrors.status = 'Vui lòng chọn trạng thái'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            await dispatch(
                updateTuitionPaymentAsync({
                    id: payment.paymentId,
                    data: {
                        amount: Number(formData.amount),
                        month: Number(formData.month),
                        year: Number(formData.year),
                        status: formData.status,
                        paidAt: formData.status === 'PAID' && formData.paidAt ? formData.paidAt : undefined,
                        notes: formData.notes || undefined,
                    },
                })
            ).unwrap()

            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error updating payment:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Body */}
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Student Info */}
                <div className="bg-background-secondary rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-foreground mb-3">Thông tin học sinh</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground-light">Họ tên:</span>
                            <span className="text-sm font-medium text-foreground">
                                {payment.student?.fullName || 'N/A'}
                            </span>
                        </div>
                        {payment.student?.studentPhone && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground-light">SĐT học sinh:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {payment.student.studentPhone}
                                </span>
                            </div>
                        )}
                        {payment.student?.parentPhone && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground-light">SĐT phụ huynh:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {payment.student.parentPhone}
                                </span>
                            </div>
                        )}
                        {payment.student?.school && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground-light">Trường:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {payment.student.school}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Amount */}
                <CurrencyInput
                    label="Số tiền"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Nhập số tiền học phí..."
                    error={errors.amount}
                    helperText="Số tiền học phí cần thu (VNĐ)"
                    required
                />

                {/* Month & Year */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Tháng <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            value={formData.month}
                            onChange={(value) => handleChange({ target: { name: 'month', value } })}
                            options={MONTH_OPTIONS}
                            placeholder="Chọn tháng"
                            error={errors.month}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Năm <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            value={formData.year}
                            onChange={(value) => handleChange({ target: { name: 'year', value } })}
                            options={YEAR_OPTIONS}
                            placeholder="Chọn năm"
                            error={errors.year}
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={formData.status}
                        onChange={(value) => handleChange({ target: { name: 'status', value } })}
                        options={TUITION_PAYMENT_STATUS_OPTIONS}
                        placeholder="Chọn trạng thái"
                        error={errors.status}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Trạng thái thanh toán học phí
                    </p>
                </div>

                {/* Paid At - Only show when status is PAID */}
                {formData.status === 'PAID' && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Ngày thanh toán
                        </label>
                        <Input
                            type="date"
                            name="paidAt"
                            value={formData.paidAt}
                            onChange={handleChange}
                            placeholder="Chọn ngày thanh toán"
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Để trống để tự động lấy ngày hiện tại
                        </p>
                    </div>
                )}

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Ghi chú
                    </label>
                    <Textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Ghi chú thêm về học phí..."
                        rows={4}
                        maxLength={500}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Ghi chú bổ sung (nếu có)
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border px-6 py-4 flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                >
                    Cập nhật
                </Button>
            </div>
        </form>
    )
}
