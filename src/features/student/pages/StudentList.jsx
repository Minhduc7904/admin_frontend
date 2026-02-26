import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Plus, Download } from 'lucide-react'

import {
    Button,
    RightPanel
} from '../../../shared/components'
import {
    getAllStudentsAsync,
    setFilters,
    selectStudents,
    selectStudentLoadingGet,
    selectStudentPagination,
    selectStudentFilters,
    getStudentStatsByStatusAsync,
    getStudentStatsByGradeAsync,
    selectShowStats,
    setShowStats,
    exportStudentListAsync,
    selectStudentLoadingExport,
} from '../store/studentSlice'

import { useSearch, useHasPermission } from '../../../shared/hooks'
import {
    StudentFilters,
    StudentTable,
    AddStudent,
    ExportStudentListModal
} from '../components'
import { QuickAttendance } from '../../attendance/components'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { ROUTES, PERMISSIONS } from '../../../core/constants'
import { toggleUserActivationAsync } from '../../user/store/userSlice'
import { StudentStats } from '../components/StudentStats'
import { CanAccess } from '../../../shared/components/permissions'

/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * 
 * Router Level (AdminRouter.jsx):
 * - PERMISSIONS.ADMIN_PAGE.STUDENTS ('admin:page:students')
 *   → Quyền truy cập trang quản lý học sinh
 * 
 * Page Operations:
 * - PERMISSIONS.STUDENT.GET_ALL ('student:get-all')
 *   → Quyền xem danh sách tất cả học sinh (getAllStudentsAsync)
 * 
 * - PERMISSIONS.STUDENT.CREATE ('student:create')
 *   → Quyền tạo học sinh mới (nút "Thêm học sinh mới")
 * 
 * - PERMISSIONS.STUDENT.GET_BY_ID ('student:get-by-id')
 *   → Quyền xem chi tiết học sinh (nút "Xem" trong bảng)
 * 
 * - PERMISSIONS.USER.TOGGLE_ACTIVATION ('user:toggle-activation')
 *   → Quyền kích hoạt/vô hiệu hóa tài khoản học sinh
 * 
 * - PERMISSIONS.STUDENT.EXPORT_EXCEL ('student:export-excel')
 *   → Quyền xuất danh sách học sinh ra file Excel
 */

export const StudentList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* ===================== REDUX ===================== */
    const students = useSelector(selectStudents)
    const loadingGet = useSelector(selectStudentLoadingGet)
    const pagination = useSelector(selectStudentPagination)
    const filters = useSelector(selectStudentFilters)
    const showStats = useSelector(selectShowStats)
    const loadingExport = useSelector(selectStudentLoadingExport)
    const [isExportModalOpen, setIsExportModalOpen] = useState(false)

    /* ===================== SEARCH ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    )

    /* ===================== LOCAL STATE ===================== */
    const [currentPage, setCurrentPage] = useState(pagination.page || 1)
    const [itemsPerPage, setItemsPerPage] = useState(pagination.limit || 10)

    const [selectedGrade, setSelectedGrade] = useState(filters.grade || '')
    const [selectedIsActive, setSelectedIsActive] = useState(filters.isActive || '')
    const [fromDate, setFromDate] = useState(filters.fromDate || '')
    const [toDate, setToDate] = useState(filters.toDate || '')

    const [sort, setSort] = useState({
        field: filters.sortBy || 'createdAt',
        direction: filters.sortOrder || 'desc',
    })

    const [openAddStudentRightPanel, setOpenAddStudentRightPanel] = useState(false)
    const [quickAttendanceStudent, setQuickAttendanceStudent] = useState(null)

    /* ===================== PERMISSIONS ===================== */
    const canCreateStudent = useHasPermission(PERMISSIONS.STUDENT.CREATE)
    const canViewStudent = useHasPermission(PERMISSIONS.STUDENT.GET_BY_ID)
    const canToggleActivation = useHasPermission(PERMISSIONS.USER.TOGGLE_ACTIVATION)
    const canExportExcel = useHasPermission(PERMISSIONS.STUDENT.EXPORT_EXCEL)

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadStudents()

    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        selectedGrade,
        selectedIsActive,
        fromDate,
        toDate,
        sort.field,
        sort.direction,
    ])

    useEffect(() => {
        if (showStats) {
            loadStats()
        }
    }, [
        selectedGrade,
        selectedIsActive,
        fromDate,
        toDate,
        showStats
    ])

    /* ===================== API ===================== */
    const loadStudents = () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
            grade: selectedGrade || undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
            sortBy: sort.field,
            sortOrder: sort.direction,
        }

        if (selectedIsActive === 'true') params.isActive = true
        if (selectedIsActive === 'false') params.isActive = false

        dispatch(getAllStudentsAsync(params))
    }

    const loadStats = () => {
        const params = {
            grade: selectedGrade || undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
        }

        if (selectedIsActive === 'true') params.isActive = true
        if (selectedIsActive === 'false') params.isActive = false
        dispatch(getStudentStatsByStatusAsync(params))
        dispatch(getStudentStatsByGradeAsync(params))
    }

    /* ===================== EXPORT ===================== */
    const handleOpenExportModal = () => {
        setIsExportModalOpen(true)
    }

    const handleExport = async (options) => {
        try {
            await dispatch(
                exportStudentListAsync(options)
            ).unwrap()

            setIsExportModalOpen(false)
        } catch (err) {
            console.error('Export student list failed:', err)
        }
    }

    /* ===================== HELPERS ===================== */
    const resetPageAndSetFilter = (payload) => {
        setCurrentPage(1)
        dispatch(setFilters(payload))
    }

    /* ===================== FILTER HANDLERS ===================== */
    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value)
        resetPageAndSetFilter({ search: value })
    }

    const handleGradeChange = (value) => {
        setSelectedGrade(value)
        resetPageAndSetFilter({ grade: value })
    }

    const handleIsActiveChange = (value) => {
        setSelectedIsActive(value)
        resetPageAndSetFilter({ isActive: value })
    }

    const handleFromDateChange = (value) => {
        setFromDate(value)
        resetPageAndSetFilter({ fromDate: value })
    }

    const handleToDateChange = (value) => {
        setToDate(value)
        resetPageAndSetFilter({ toDate: value })
    }

    /* ===================== SORT ===================== */
    const handleSortChange = (field, direction) => {
        setSort({ field, direction })
        dispatch(setFilters({ sortBy: field, sortOrder: direction }))
        setCurrentPage(1)
    }

    /* ===================== PAGINATION ===================== */
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    /* ===================== ACTIONS ===================== */
    const handleView = (student) => {
        if (!canViewStudent) return
        navigate(ROUTES.STUDENT_DETAIL(student.studentId))
    }

    const handleToggleActivation = async (student) => {
        if (!canToggleActivation) return
        await dispatch(toggleUserActivationAsync(student.userId)).unwrap()
        loadStudents()
    }

    /* ===================== RENDER ===================== */
    return (
        <>
            {/* ===================== HEADER ===================== */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Quản lý học sinh
                        </h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý danh sách học sinh trong hệ thống.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <CanAccess permission={PERMISSIONS.STUDENT.EXPORT_EXCEL}>
                            <Button
                                variant="outline"
                                onClick={handleOpenExportModal}
                                disabled={loadingExport}
                                loading={loadingExport}
                            >
                                <Download size={16} />
                                Xuất Excel
                            </Button>
                        </CanAccess>

                        <CanAccess permission={PERMISSIONS.STUDENT.CREATE}>
                            <Button onClick={() => setOpenAddStudentRightPanel(true)}>
                                <Plus size={16} />
                                Thêm học sinh mới
                            </Button>
                        </CanAccess>
                    </div>
                </div>

                {/* ===================== FILTERS ===================== */}
                <StudentFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    grade={selectedGrade}
                    onGradeChange={handleGradeChange}
                    isActive={selectedIsActive}
                    onIsActiveChange={handleIsActiveChange}
                    fromDate={fromDate}
                    onFromDateChange={handleFromDateChange}
                    toDate={toDate}
                    onToDateChange={handleToDateChange}
                    onToggleStats={() => dispatch(setShowStats(!showStats))}
                    showStats={showStats}
                />

                {/* ===================== STATS ===================== */}
                {showStats && (
                    <div className="mt-4 animate-fade-in">
                        <StudentStats
                            loadStats={loadStats}
                        />
                    </div>
                )}
            </div>

            {/* ===================== TABLE ===================== */}
            <div className="bg-white border border-border rounded-sm">
                <StudentTable
                    students={students}
                    loading={loadingGet}
                    sort={sort}
                    onSortChange={handleSortChange}
                    onView={handleView}
                    onToggleActivation={handleToggleActivation}
                    onQuickAttendance={(student) => setQuickAttendanceStudent(student)}
                    canViewStudent={canViewStudent}
                    canToggleActivation={canToggleActivation}
                />

                {/* ===================== PAGINATION + PANEL ===================== */}
                <div className="p-4 border-t border-border">
                    <RightPanel
                        isOpen={openAddStudentRightPanel}
                        onClose={() => setOpenAddStudentRightPanel(false)}
                        title="Thêm học sinh mới"
                    >
                        <AddStudent
                            onClose={() => setOpenAddStudentRightPanel(false)}
                            loadStudents={loadStudents}
                        />
                    </RightPanel>

                    <RightPanel
                        isOpen={!!quickAttendanceStudent}
                        onClose={() => setQuickAttendanceStudent(null)}
                        title="Điểm danh nhanh"
                    >
                        <QuickAttendance
                            student={quickAttendanceStudent}
                            onClose={() => setQuickAttendanceStudent(null)}
                        />
                    </RightPanel>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        itemsPerPage={itemsPerPage}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>
            </div>
            {/* ===================== EXPORT MODAL ===================== */}
            <ExportStudentListModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onConfirm={handleExport}
                loading={loadingExport}
            />
        </>
    )
}
