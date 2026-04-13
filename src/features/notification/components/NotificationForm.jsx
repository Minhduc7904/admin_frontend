import { useState } from 'react'
import { Button, Input, Dropdown, Checkbox } from '../../../shared/components/ui'
import { MarkdownEditorPreview } from '../../../shared/components/markdown/MarkdownEditorPreview'

/**
 * NotificationForm
 * - Permission-aware
 * - Không quyền => read-only / không submit
 */
export const NotificationForm = ({
    onSubmit,
    loading = false,

    /* ===== SELECTION ===== */
    selectedStudents = [],

    /* ===== RECIPIENT TYPE ===== */
    showRecipientTypeSelector = false,
    recipientType = 'STUDENT',
    onRecipientTypeChange,

    /* ===== PERMISSIONS ===== */
    canSendAll = false,
    canSendStudents = false,
    canSendAdmins = false,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'SYSTEM',
        level: 'INFO',
        shouldShowReminderModal: false,
    })

    const [errors, setErrors] = useState({})

    /* ======================================================
       PERMISSION HELPERS
    ====================================================== */

    const canUseRecipientType = (type) => {
        if (type === 'ALL') return canSendAll
        if (type === 'STUDENT') return canSendStudents
        if (type === 'UNPAID_TUITION_STUDENTS') return canSendStudents
        if (type === 'ADMIN') return canSendAdmins
        return false
    }

    const canSubmit =
        recipientType === 'ALL'
            ? canSendAll
            : recipientType === 'UNPAID_TUITION_STUDENTS'
                ? canSendStudents
                : recipientType === 'ADMIN'
                    ? canSendAdmins
                    : canSendStudents

    /* ======================================================
       HANDLERS
    ====================================================== */

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[name]
                return next
            })
        }
    }

    const handleDropdownChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))

        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[name]
                return next
            })
        }
    }

    const handleReminderModalChange = () => {
        setFormData((prev) => ({
            ...prev,
            shouldShowReminderModal: !prev.shouldShowReminderModal,
        }))
    }

    const validate = () => {
        const nextErrors = {}

        if (!formData.title.trim()) {
            nextErrors.title = 'Tiêu đề không được để trống'
        } else if (formData.title.length > 200) {
            nextErrors.title = 'Tiêu đề không được quá 200 ký tự'
        }

        if (!formData.message.trim()) {
            nextErrors.message = 'Nội dung không được để trống'
        } else if (formData.message.length > 1000) {
            nextErrors.message = 'Nội dung không được quá 1000 ký tự'
        }

        if (!canSubmit) {
            nextErrors.permission = 'Bạn không có quyền gửi loại thông báo này'
        }

        if (
            recipientType !== 'ALL' &&
            recipientType !== 'UNPAID_TUITION_STUDENTS' &&
            selectedStudents.length === 0
        ) {
            const label =
                recipientType === 'ADMIN' ? 'quản trị viên' : 'học sinh'
            nextErrors.students = `Vui lòng chọn ít nhất 1 ${label}`
        }

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return
        onSubmit(formData)
    }

    const handleReset = () => {
        setFormData({
            title: '',
            message: '',
            type: 'SYSTEM',
            level: 'INFO',
            shouldShowReminderModal: false,
        })
        setErrors({})
    }

    /* ======================================================
       OPTIONS
    ====================================================== */

    const typeOptions = [
        { value: 'SYSTEM', label: 'Hệ thống' },
        { value: 'COURSE', label: 'Khóa học' },
        { value: 'LESSON', label: 'Buổi học' },
        { value: 'ATTENDANCE', label: 'Điểm danh' },
        { value: 'MESSAGE', label: 'Tin nhắn' },
        { value: 'OTHER', label: 'Khác' },
    ]

    const levelOptions = [
        { value: 'INFO', label: 'Thông tin' },
        { value: 'SUCCESS', label: 'Thành công' },
        { value: 'WARNING', label: 'Cảnh báo' },
        { value: 'ERROR', label: 'Lỗi' },
    ]

    const recipientTypeOptions = [
        { value: 'ALL', label: 'Tất cả người dùng', disabled: !canSendAll },
        {
            value: 'UNPAID_TUITION_STUDENTS',
            label: 'Tất cả học sinh chưa đóng học phí',
            disabled: !canSendStudents,
        },
        { value: 'ADMIN', label: 'Quản trị viên', disabled: !canSendAdmins },
        { value: 'STUDENT', label: 'Học sinh', disabled: !canSendStudents },
    ]

    const isFormDisabled = loading || !canSubmit

    /* ======================================================
       RENDER
    ====================================================== */

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 space-y-6">
                <div className="bg-white border border-border rounded-sm p-4">
                    <h3 className="text-lg font-semibold mb-4">
                        Thông tin thông báo
                    </h3>

                    {/* Recipient Type */}
                    {showRecipientTypeSelector && (
                        <div className="mb-4">

                            <Dropdown
                                value={recipientType}
                                onChange={(value) => {
                                    if (!canUseRecipientType(value)) return
                                    onRecipientTypeChange?.(value)
                                }}
                                options={recipientTypeOptions}
                                placeholder="Chọn đối tượng nhận..."
                                disabled={loading}
                                label={"Gửi đến"}
                            />
                        </div>
                    )}

                    {/* Permission error */}
                    {errors.permission && (
                        <div className="mb-4 p-3 text-sm text-error bg-error/10 border border-error/30 rounded-sm">
                            {errors.permission}
                        </div>
                    )}

                    {/* Title */}
                    <Input
                        label="Tiêu đề"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Nhập tiêu đề thông báo..."
                        error={errors.title}
                        disabled={isFormDisabled}
                        maxLength={200}
                        required
                    />

                    {/* Message */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">
                            Nội dung <span className="text-error">*</span>
                        </label>
                        <MarkdownEditorPreview
                            value={formData.message}
                            onChange={(value) => {
                                setFormData((prev) => ({ ...prev, message: value }))
                                if (errors.message) {
                                    setErrors((prev) => {
                                        const next = { ...prev }
                                        delete next.message
                                        return next
                                    })
                                }
                            }}
                            height="320px"
                            editable={!isFormDisabled}
                            maxLength={1000}
                        />
                        {errors.message && (
                            <p className="mt-1 text-sm text-error">{errors.message}</p>
                        )}
                    </div>

                    {/* Type */}
                    <div className="mt-4">
                        <Dropdown
                            value={formData.type}
                            onChange={(v) =>
                                handleDropdownChange('type', v)
                            }
                            options={typeOptions}
                            disabled={isFormDisabled}
                            label={"Loại tin nhắn"}
                        />
                    </div>

                    {/* Level */}
                    <div className="mt-4">
                        <Dropdown
                            value={formData.level}
                            onChange={(v) =>
                                handleDropdownChange('level', v)
                            }
                            options={levelOptions}
                            disabled={isFormDisabled}
                            label={"Mức độ tin nhắn"}
                        />
                    </div>

                    <div className="mt-4">
                        <Checkbox
                            checked={formData.shouldShowReminderModal}
                            onChange={handleReminderModalChange}
                            label="Hiển thị popup nhắc nhở"
                        />
                    </div>

                    {/* Students error */}
                    {errors.students && (
                        <div className="mt-4 text-sm text-error">
                            {errors.students}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border px-6 py-4 flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                >
                    Đặt lại
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    disabled={!canSubmit}
                >
                    Gửi thông báo
                </Button>
            </div>
        </form>
    )
}
