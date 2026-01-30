import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Download } from 'lucide-react'

import { Button, Dropdown } from '../../../../../shared/components/ui'
import {
    selectExportExample,
    setExportExample,
    exportTuitionPaymentExcelExampleAsync,
} from '../../../store/tuitionPaymentSlice'
import { MONTH_OPTIONS, YEAR_OPTIONS } from '../utils/constants'

export const ExportExcel = () => {
    const dispatch = useDispatch()
    const exportExample = useSelector(selectExportExample)

    const now = new Date()
    const [month, setMonth] = useState(exportExample.month || now.getMonth() + 1)
    const [year, setYear] = useState(exportExample.year || now.getFullYear())

    useEffect(() => {
        dispatch(setExportExample({ month, year }))
    }, [month, year, dispatch])

    const handleExport = async () => {
        await dispatch(
            exportTuitionPaymentExcelExampleAsync({ month, year })
        ).unwrap()
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
                <Download size={16} /> Xuất file mẫu
            </h3>

            <Dropdown
                label="Tháng"
                value={month}
                onChange={setMonth}
                options={MONTH_OPTIONS}
            />

            <Dropdown
                label="Năm"
                value={year}
                onChange={setYear}
                options={YEAR_OPTIONS}
            />

            <Button onClick={handleExport} className="w-full">
                <Download size={16} />
                Xuất Excel mẫu
            </Button>
        </div>
    )
}
