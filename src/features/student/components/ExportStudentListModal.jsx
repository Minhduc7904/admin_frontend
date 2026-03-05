import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Download } from 'lucide-react'

import {
    Modal,
    Button,
    Checkbox,
    Dropdown,
    Input,
} from '../../../shared/components/ui'

import { GRADE_OPTIONS } from '../../../core/constants/grade-constants'
import { IS_ACTIVE_OPTIONS } from '../../../core/constants/is-active.constants'
import { TIME_RANGE_OPTIONS } from '../../../core/constants/options'
import { getDateRange } from '../../../shared/utils'
import { CourseClassSearchMultiSelect } from '../../courseClass/components/CourseClassSearchMultiSelect'

import {
    selectStudentExportExcelOptions,
    setStudentExportExcelOptions,
} from '../store/studentSlice'

const TIME_RANGE_OPTIONS_WITH_DEFAULT = [
    { value: '', label: 'Tùy chọn' },
    ...TIME_RANGE_OPTIONS,
]

export const ExportStudentListModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
}) => {
    const dispatch = useDispatch()
    const exportOptions = useSelector(selectStudentExportExcelOptions)

    const [timeRange, setTimeRange] = useState('')
    const [selectedClasses, setSelectedClasses] = useState([])

    /* ===================== FILTER HANDLERS (IN OPTIONS) ===================== */
    const updateOption = (field) => (value) => {
        dispatch(setStudentExportExcelOptions({ [field]: value }))
    }

    const handleTimeRangeChange = (value) => {
        setTimeRange(value)

        if (!value) {
            dispatch(
                setStudentExportExcelOptions({
                    fromDate: '',
                    toDate: '',
                })
            )
            return
        }

        const { fromDate, toDate } = getDateRange(value)
        dispatch(
            setStudentExportExcelOptions({
                fromDate,
                toDate,
            })
        )
    }

    /* ===================== CHECKBOX ===================== */
    const handleCheckboxChange = (field) => (checked) => {
        dispatch(setStudentExportExcelOptions({ [field]: checked }))
    }

    /* ===================== SUBMIT ===================== */
    const handleSubmit = (e) => {
        e.preventDefault()
        onConfirm(exportOptions)
    }

    const handleClose = () => {
        setTimeRange('')
        setSelectedClasses([])
        onClose()
    }

    const handleClassesChange = (classes) => {
        setSelectedClasses(classes)
        dispatch(setStudentExportExcelOptions({ classIds: classes.map((c) => c.classId) }))
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="xl"
            title="Xuất danh sách học sinh"
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
                                value={exportOptions.grade}
                                onChange={updateOption('grade')}
                                options={GRADE_OPTIONS}
                                placeholder="Khối học"
                            />

                            <Dropdown
                                value={
                                    exportOptions.isActive === true
                                        ? 'true'
                                        : exportOptions.isActive === false
                                            ? 'false'
                                            : ''
                                }
                                onChange={(value) =>
                                    updateOption('isActive')(
                                        value === ''
                                            ? undefined
                                            : value === 'true'
                                    )
                                }
                                options={IS_ACTIVE_OPTIONS}
                                placeholder="Trạng thái"
                            />
                        </div>
                        <div>
                            <Dropdown
                                label="Khoảng thời gian"
                                value={timeRange}
                                onChange={handleTimeRangeChange}
                                options={TIME_RANGE_OPTIONS_WITH_DEFAULT}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <Input
                                type="date"
                                label="Từ ngày tham gia"
                                value={exportOptions.fromDate}
                                onChange={(e) => {
                                    updateOption('fromDate')(e.target.value)
                                    setTimeRange('')
                                }}
                            />

                            <Input
                                type="date"
                                label="Đến ngày tham gia"
                                value={exportOptions.toDate}
                                onChange={(e) => {
                                    updateOption('toDate')(e.target.value)
                                    setTimeRange('')
                                }}
                            />
                        </div>

                        <div>
                            <CourseClassSearchMultiSelect
                                label="Lớp học đã tham gia"
                                placeholder="Tìm kiếm lớp học..."
                                value={selectedClasses}
                                onChange={handleClassesChange}
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
                                <strong>Mặc định:</strong> STT, Mã học sinh, Họ, Tên
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <Checkbox label="Trường" checked={exportOptions.includeSchool} onChange={handleCheckboxChange('includeSchool')} />
                                <Checkbox label="Giới tính" checked={exportOptions.includeGender} onChange={handleCheckboxChange('includeGender')} />
                                <Checkbox label="Ngày sinh" checked={exportOptions.includeDateOfBirth} onChange={handleCheckboxChange('includeDateOfBirth')} />
                                <Checkbox label="Username" checked={exportOptions.includeUsername} onChange={handleCheckboxChange('includeUsername')} />
                                <Checkbox label="SĐT phụ huynh" checked={exportOptions.includeParentPhone} onChange={handleCheckboxChange('includeParentPhone')} />
                                <Checkbox label="SĐT học sinh" checked={exportOptions.includeStudentPhone} onChange={handleCheckboxChange('includeStudentPhone')} />
                                <Checkbox label="Khối" checked={exportOptions.includeGrade} onChange={handleCheckboxChange('includeGrade')} />
                                <Checkbox label="Email" checked={exportOptions.includeEmail} onChange={handleCheckboxChange('includeEmail')} />
                                <Checkbox label="Trạng thái" checked={exportOptions.includeIsActive} onChange={handleCheckboxChange('includeIsActive')} />
                                <Checkbox label="Ngày tạo" checked={exportOptions.includeCreatedAt} onChange={handleCheckboxChange('includeCreatedAt')} />
                                <Checkbox label="Lớp học (pivot)" checked={exportOptions.includeClasses} onChange={handleCheckboxChange('includeClasses')} />
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
