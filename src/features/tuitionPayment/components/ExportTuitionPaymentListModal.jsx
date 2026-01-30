import { useDispatch, useSelector } from 'react-redux'
import { Download } from 'lucide-react'

import {
    Modal,
    Button,
    Checkbox,
    Dropdown,
    Input,
} from '../../../shared/components/ui'

import {
    selectTuitionPaymentExportExcelOptions,
    setTuitionPaymentExportExcelOptions,
} from '../store/tuitionPaymentSlice'
import { TUITION_PAYMENT_STATUS_OPTIONS } from '../constants/tuition-payment.constant'

const STATUS_OPTIONS_WITH_DEFAULT = [
    { value: '', label: 'Tất cả trạng thái' },
    ...TUITION_PAYMENT_STATUS_OPTIONS,
]

const MONTH_OPTIONS = [
    { value: '', label: 'Tất cả tháng' },
    ...Array.from({ length: 12 }).map((_, i) => ({
        value: i + 1,
        label: `Tháng ${i + 1}`,
    })),
]

const YEAR_OPTIONS = [
    { value: '', label: 'Tất cả năm' },
    ...Array.from({ length: 6 }).map((_, i) => {
        const year = new Date().getFullYear() - i
        return { value: year, label: `Năm ${year}` }
    }),
]

export const ExportTuitionPaymentListModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
}) => {
    const dispatch = useDispatch()
    const exportOptions = useSelector(selectTuitionPaymentExportExcelOptions)

    /* ===================== FILTER HANDLERS (IN OPTIONS) ===================== */
    const updateOption = (field) => (value) => {
        dispatch(setTuitionPaymentExportExcelOptions({ [field]: value }))
    }

    /* ===================== CHECKBOX ===================== */
    const handleCheckboxChange = (field) => (checked) => {
        dispatch(setTuitionPaymentExportExcelOptions({ [field]: checked }))
    }

    /* ===================== SUBMIT ===================== */
    const handleSubmit = (e) => {
        e.preventDefault()
        onConfirm(exportOptions)
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="xl"
            title="Xuất danh sách học phí"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6 mb-6">

                    {/* ===================== FILTERS ===================== */}
                    <div className="bg-white border border-border rounded-sm p-4 space-y-4">
                        <p className="text-sm font-medium text-foreground">
                            Bộ lọc dữ liệu
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Dropdown
                                value={exportOptions.month}
                                onChange={updateOption('month')}
                                options={MONTH_OPTIONS}
                                placeholder="Tháng"
                            />

                            <Dropdown
                                value={exportOptions.year}
                                onChange={updateOption('year')}
                                options={YEAR_OPTIONS}
                                placeholder="Năm"
                            />
                        </div>

                        <div>
                            <Dropdown
                                value={exportOptions.status}
                                onChange={updateOption('status')}
                                options={STATUS_OPTIONS_WITH_DEFAULT}
                                placeholder="Trạng thái"
                            />
                        </div>
                    </div>

                    {/* ===================== EXPORT OPTIONS ===================== */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Chọn các trường cần xuất
                        </label>

                        <div className="bg-background rounded-sm border border-border p-4 space-y-4">
                            <p className="text-xs text-foreground-light">
                                <strong>Mặc định:</strong> STT, Mã học sinh, Họ tên học sinh
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <Checkbox 
                                    label="Tên học sinh" 
                                    checked={exportOptions.includeStudentName} 
                                    onChange={handleCheckboxChange('includeStudentName')} 
                                />
                                <Checkbox 
                                    label="SĐT học sinh" 
                                    checked={exportOptions.includeStudentPhone} 
                                    onChange={handleCheckboxChange('includeStudentPhone')} 
                                />
                                <Checkbox 
                                    label="SĐT phụ huynh" 
                                    checked={exportOptions.includeParentPhone} 
                                    onChange={handleCheckboxChange('includeParentPhone')} 
                                />
                                <Checkbox 
                                    label="Trường học" 
                                    checked={exportOptions.includeSchool} 
                                    onChange={handleCheckboxChange('includeSchool')} 
                                />
                                <Checkbox 
                                    label="Khối" 
                                    checked={exportOptions.includeGrade} 
                                    onChange={handleCheckboxChange('includeGrade')} 
                                />
                                <Checkbox 
                                    label="Số tiền" 
                                    checked={exportOptions.includeAmount} 
                                    onChange={handleCheckboxChange('includeAmount')} 
                                />
                                <Checkbox 
                                    label="Tháng" 
                                    checked={exportOptions.includeMonth} 
                                    onChange={handleCheckboxChange('includeMonth')} 
                                />
                                <Checkbox 
                                    label="Năm" 
                                    checked={exportOptions.includeYear} 
                                    onChange={handleCheckboxChange('includeYear')} 
                                />
                                <Checkbox 
                                    label="Trạng thái" 
                                    checked={exportOptions.includeStatus} 
                                    onChange={handleCheckboxChange('includeStatus')} 
                                />
                                <Checkbox 
                                    label="Ngày đóng" 
                                    checked={exportOptions.includePaidAt} 
                                    onChange={handleCheckboxChange('includePaidAt')} 
                                />
                                <Checkbox 
                                    label="Ghi chú" 
                                    checked={exportOptions.includeNotes} 
                                    onChange={handleCheckboxChange('includeNotes')} 
                                />
                                <Checkbox 
                                    label="Ngày tạo" 
                                    checked={exportOptions.includeCreatedAt} 
                                    onChange={handleCheckboxChange('includeCreatedAt')} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===================== ACTIONS ===================== */}
                <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                        Hủy
                    </Button>

                    <Button type="submit" loading={loading} disabled={loading}>
                        <Download size={16} />
                        Xuất Excel
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
