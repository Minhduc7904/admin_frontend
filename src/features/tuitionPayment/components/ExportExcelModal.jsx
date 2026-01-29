import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Download } from 'lucide-react'

import { Modal, Button, Dropdown } from '../../../shared/components/ui'

import {
    selectExportExample,
    setExportExample,
    exportTuitionPaymentExcelExampleAsync,
    selectImportPreview,
    selectTuitionPaymentLoadingImport,
    importTuitionPaymentExcelPreviewAsync,
} from '../store/tuitionPaymentSlice'

/* ===================== OPTIONS ===================== */
const MONTH_OPTIONS = Array.from({ length: 12 }).map((_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
}))

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 5 }).map((_, i) => {
    const year = CURRENT_YEAR - i
    return { value: year, label: `Năm ${year}` }
})

/* ===================== MODAL ===================== */
export const ExportExcelModal = ({ isOpen }) => {
    const dispatch = useDispatch()
    const exportExample = useSelector(selectExportExample)

    const now = new Date()

    const [month, setMonth] = useState(exportExample.month || now.getMonth() + 1)
    const [year, setYear] = useState(exportExample.year || now.getFullYear())

    /* ===================== SYNC TO STORE ===================== */
    useEffect(() => {
        dispatch(
            setExportExample({
                month,
                year,
            }),
        )
    }, [month, year])

    /* ===================== ACTION ===================== */
    const handleExport = async () => {
        await dispatch(
            exportTuitionPaymentExcelExampleAsync({
                month,
                year,
            }),
        ).unwrap()
        // ❗ KHÔNG onClose – xử lý tiếp bên ngoài
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Xuất file Excel mẫu học phí"
            maxWidth="sm"
        >
            <div className="space-y-6">
                {/* ===================== FILTER ===================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Dropdown
                        label="Tháng"
                        value={month}
                        onChange={setMonth}
                        options={MONTH_OPTIONS}
                        required
                    />

                    <Dropdown
                        label="Năm"
                        value={year}
                        onChange={setYear}
                        options={YEAR_OPTIONS}
                        required
                    />
                </div>

                {/* ===================== ACTION ===================== */}
                <div className="flex justify-end">
                    <Button onClick={handleExport}>
                        <Download size={16} />
                        Xuất Excel mẫu
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
