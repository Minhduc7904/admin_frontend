import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input, Checkbox, Dropdown } from '../../../shared/components/ui'
import { Spinner } from '../../../shared/components/loading'

/* ======================================================
   SUB COMPONENTS (INTERNAL)
====================================================== */

const StudentListHeader = ({ selectedCount, total }) => (
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Danh sách học sinh</h3>
        <div className="text-sm text-foreground-light">
            {selectedCount}/{total} đã chọn
        </div>
    </div>
)

const StudentSearch = ({ value, onChange, grade, onGradeChange, gradeOptions }) => (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* SEARCH */}
        <div className="relative flex-1">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light"
                size={18}
            />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Tìm kiếm học sinh..."
                className="pl-10"
            />
        </div>

        {/* DROPDOWN */}
        {grade !== undefined && onGradeChange && (
            <div className="w-full sm:w-48 shrink-0">
                <Dropdown
                    value={grade}
                    onChange={onGradeChange}
                    options={gradeOptions}
                    placeholder="Chọn khối"
                />
            </div>
        )}
    </div>
)

const SelectAllBar = ({ isAllSelected, isSomeSelected, onToggle }) => (
    <div className="flex items-center gap-2 p-2 bg-surface-light rounded-sm">
        <Checkbox
            checked={isAllSelected}
            onChange={onToggle}
            label={isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        />
        {isSomeSelected && !isAllSelected && (
            <span className="text-xs text-foreground-light ml-auto">
                (Một số được chọn)
            </span>
        )}
    </div>
)

const StudentRow = ({ studentItem, isSelected, onToggle, isLast }) => {
    const student = studentItem.student ? studentItem.student : studentItem

    return (
        <div
            className={`
                px-4 py-2 transition-colors cursor-pointer
                flex items-center gap-3
                ${!isLast ? 'border-b border-border' : ''}
                ${isSelected ? 'bg-primary/5' : 'hover:bg-gray-50'}
            `}
            onClick={onToggle}
        >
            {/* Checkbox */}
            <Checkbox
                checked={isSelected}
                onChange={onToggle}
            />

            {/* Main content */}
            <div className="flex-1 min-w-0">
                {/* Line 1: Name + Grade */}
                <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-foreground truncate">
                        {student?.fullName || 'N/A'}
                    </span>

                    {student?.grade && (
                        <span className="text-xs px-2 py-0.5 rounded bg-surface-light text-foreground-light shrink-0">
                            Khối {student.grade}
                        </span>
                    )}
                </div>

                {/* Line 2: Meta info (inline) */}
                <div className="text-xs text-foreground-light truncate">
                    {student?.email && <span>{student.email}</span>}

                    {student?.studentPhone && (
                        <span className="mx-1">•</span>
                    )}
                    {student?.studentPhone && (
                        <span>HS: {student.studentPhone}</span>
                    )}

                    {student?.parentPhone && (
                        <span className="mx-1">•</span>
                    )}
                    {student?.parentPhone && (
                        <span>PH: {student.parentPhone}</span>
                    )}

                    {student?.school && (
                        <span className="mx-1">•</span>
                    )}
                    {student?.school && (
                        <span>{student.school}</span>
                    )}
                </div>
            </div>
        </div>
    )
}


const StudentListContent = ({
    students,
    filteredStudents,
    selectedStudentIds,
    searchTerm,
    onToggleStudent,

}) => {
    if (students.length === 0) {
        return (
            <div className="p-8 text-center text-foreground-light">
                Chưa có học sinh nào trong lớp
            </div>
        )
    }

    if (filteredStudents.length === 0 && searchTerm) {
        return (
            <div className="p-8 text-center text-foreground-light">
                Không tìm thấy học sinh phù hợp
            </div>
        )
    }

    return (
        <div>
            {filteredStudents.map((item, index) => (
                <StudentRow
                    key={item.studentId}
                    studentItem={item}
                    isSelected={selectedStudentIds.includes(item.studentId)}
                    onToggle={() => onToggleStudent(item.studentId)}
                    isLast={index === filteredStudents.length - 1}
                />
            ))}
        </div>
    )
}

/* ======================================================
   MAIN COMPONENT
====================================================== */

export const StudentSelectionList = ({
    students = [],
    selectedStudentIds = [],
    onSelectionChange,
    loading = false,
    grade,
    onGradeChange,
    gradeOptions,
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const filteredStudents = useMemo(() => {
        if (!searchTerm.trim()) return students
        const term = searchTerm.toLowerCase()

        return students.filter(({ student }) =>
            student?.fullName?.toLowerCase().includes(term) ||
            student?.email?.toLowerCase().includes(term) ||
            student?.studentPhone?.includes(term) ||
            student?.parentPhone?.includes(term) ||
            student?.school?.toLowerCase().includes(term)
        )
    }, [students, searchTerm])

    const isAllSelected = useMemo(() => {
        if (filteredStudents.length === 0) return false
        return filteredStudents.every((item) =>
            selectedStudentIds.includes(item.studentId)
        )
    }, [filteredStudents, selectedStudentIds])

    const isSomeSelected = useMemo(() => {
        if (filteredStudents.length === 0) return false
        return !isAllSelected && filteredStudents.some((item) =>
            selectedStudentIds.includes(item.studentId)
        )
    }, [filteredStudents, selectedStudentIds, isAllSelected])

    const handleToggleAll = () => {
        const filteredIds = filteredStudents.map((i) => i.studentId)

        if (isAllSelected) {
            onSelectionChange(
                selectedStudentIds.filter((id) => !filteredIds.includes(id))
            )
        } else {
            onSelectionChange([...new Set([...selectedStudentIds, ...filteredIds])])
        }
    }

    const handleToggleStudent = (studentId) => {
        onSelectionChange(
            selectedStudentIds.includes(studentId)
                ? selectedStudentIds.filter((id) => id !== studentId)
                : [...selectedStudentIds, studentId]
        )
    }

    if (loading) {
        return (
            <div className="bg-white border border-border rounded-sm p-6">
                <div className="flex items-center justify-center h-64">
                    <Spinner size="lg" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-border rounded-sm">
            <div className="p-4 border-b border-border">
                <StudentListHeader
                    selectedCount={selectedStudentIds.length}
                    total={students.length}
                />

                <StudentSearch
                    value={searchTerm}
                    onChange={setSearchTerm}
                    grade={grade}
                    onGradeChange={onGradeChange}
                    gradeOptions={gradeOptions}
                />

                {filteredStudents.length > 0 && (
                    <SelectAllBar
                        isAllSelected={isAllSelected}
                        isSomeSelected={isSomeSelected}
                        onToggle={handleToggleAll}
                    />
                )}
            </div>

            <div className="max-h-[600px] overflow-y-auto">
                <StudentListContent
                    students={students}
                    filteredStudents={filteredStudents}
                    selectedStudentIds={selectedStudentIds}
                    searchTerm={searchTerm}
                    onToggleStudent={handleToggleStudent}
                />
            </div>
        </div>
    )
}
