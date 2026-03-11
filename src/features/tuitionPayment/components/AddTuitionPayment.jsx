import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Button } from '../../../shared/components'
import { Input, Dropdown, CurrencyInput } from '../../../shared/components/ui'
import {
    createTuitionPaymentAsync,
    selectTuitionPaymentLoadingCreate,
} from '../store/tuitionPaymentSlice'
import { TuitionPaymentStatus, STATUS_OPTIONS } from '../constants/tuition-payment.constant'
import { StudentSearchSelect } from '../../student/components'

const MONTH_OPTIONS = Array.from({ length: 12 }).map((_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
}))

const YEAR_OPTIONS = Array.from({ length: 5 }).map((_, i) => {
    const year = new Date().getFullYear() - i
    return { value: year, label: `Năm ${year}` }
})

export const AddTuitionPayment = ({ onClose, onSuccess }) => {
    const dispatch = useDispatch()
    const loadingCreate = useSelector(selectTuitionPaymentLoadingCreate)

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        month: currentMonth,   // ✅ default tháng hiện tại
        year: currentYear,     // ✅ default năm hiện tại
        status: TuitionPaymentStatus.UNPAID,
        notes: '',
    })

    const [errors, setErrors] = useState({})

    /* ===================== HANDLERS ===================== */
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const validate = () => {
        const errs = {}

        if (!formData.studentId) errs.studentId = 'Bắt buộc chọn học sinh'
        if (!formData.month) errs.month = 'Bắt buộc chọn tháng'
        if (!formData.year) errs.year = 'Bắt buộc chọn năm'

        return errs
    }

    const handleSubmit = async () => {
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const payload = {
            studentId: Number(formData.studentId),
            amount: Number(formData.amount),
            month: Number(formData.month),
            year: Number(formData.year),
            status: formData.status,
            notes: formData.notes?.trim() || undefined,
        }

        await dispatch(createTuitionPaymentAsync(payload)).unwrap()

        if (onSuccess) await onSuccess()
        onClose?.()
    }

    /* ===================== RENDER ===================== */
    return (
        <div className="flex flex-col h-full">
            {/* ===== Content ===== */}
            <div className="flex-1 px-6 py-4 overflow-y-auto space-y-6">
                <StudentSearchSelect
                    label="Học viên"
                    placeholder="Tìm theo tên, email..."
                    value={formData.studentId}
                    onSelect={(student) => {
                        setFormData((prev) => ({
                            ...prev,
                            studentId: student?.studentId || null,
                        }))

                        // clear error khi đã chọn
                        setErrors((prev) => ({ ...prev, studentId: undefined }))
                    }}
                    error={errors.studentId}
                    required
                />

                <CurrencyInput
                    label="Số tiền học phí (VND)"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    error={errors.amount}
                    placeholder="VD: 500.000"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Dropdown
                        label="Tháng"
                        value={formData.month}
                        onChange={(v) =>
                            setFormData((p) => ({ ...p, month: v }))
                        }
                        options={MONTH_OPTIONS}
                        error={errors.month}
                        required
                    />

                    <Dropdown
                        label="Năm"
                        value={formData.year}
                        onChange={(v) =>
                            setFormData((p) => ({ ...p, year: v }))
                        }
                        options={YEAR_OPTIONS}
                        error={errors.year}
                        required
                    />
                </div>

                <Dropdown
                    label="Trạng thái"
                    value={formData.status}
                    onChange={(v) =>
                        setFormData((p) => ({ ...p, status: v }))
                    }
                    options={STATUS_OPTIONS}
                />

                <Input
                    label="Ghi chú"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="VD: Đóng tiền mặt, thu bù..."
                />
            </div>

            {/* ===== Footer ===== */}
            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>
                    Hủy
                </Button>

                <Button
                    onClick={handleSubmit}
                    loading={loadingCreate}
                    disabled={loadingCreate}
                >
                    Tạo học phí
                </Button>
            </div>
        </div>
    )
}
