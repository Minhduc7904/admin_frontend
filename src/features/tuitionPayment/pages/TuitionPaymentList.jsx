import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Download } from 'lucide-react'

import { Button, RightPanel } from '../../../shared/components'
import { Pagination, Modal } from '../../../shared/components/ui'
import { useSearch, useDebounce } from '../../../shared/hooks'

import {
    getTuitionPaymentsAsync,
    getTuitionPaymentStatsByMoneyAsync,
    getTuitionPaymentStatsByStatusAsync,
    getTuitionPaymentStatsByMonthlyAsync,
    deleteTuitionPaymentAsync,
    updateTuitionPaymentAsync,
    exportTuitionPaymentListAsync,
    setFilters,
    updatePaymentInList,
    selectTuitionPayments,
    selectTuitionPaymentPagination,
    selectTuitionPaymentLoadingGet,
    selectTuitionPaymentLoadingExportList,
    selectTuitionPaymentStatsByMoney,
    selectTuitionPaymentStatsByStatus,
    selectTuitionPaymentFilters,
} from '../store/tuitionPaymentSlice'

import {
    TuitionPaymentFilters,
    TuitionPaymentTable,
    TuitionPaymentStats,
    AddTuitionPayment,
    ExportExcelModal,
    ExportTuitionPaymentListModal,
    TuitionPaymentDetail,
    EditTuitionPayment,
} from '../components'

export const TuitionPaymentList = () => {
    const dispatch = useDispatch()

    /* ===================== REDUX ===================== */
    const payments = useSelector(selectTuitionPayments)
    const loadingGet = useSelector(selectTuitionPaymentLoadingGet)
    const loadingExportList = useSelector(selectTuitionPaymentLoadingExportList)
    const pagination = useSelector(selectTuitionPaymentPagination)
    const statsMoney = useSelector(selectTuitionPaymentStatsByMoney)
    const statsStatus = useSelector(selectTuitionPaymentStatsByStatus)
    const filters = useSelector(selectTuitionPaymentFilters)

    /* ===================== SEARCH ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search || '', 500)

    /* ===================== LOCAL STATE ===================== */
    const [currentPage, setCurrentPage] = useState(pagination.page || 1)
    const [itemsPerPage, setItemsPerPage] = useState(pagination.limit || 10)

    const [status, setStatus] = useState(filters.status || '')
    const [grade, setGrade] = useState(filters.grade || '')
    const [month, setMonth] = useState(filters.month || new Date().getMonth() + 1)
    const [year, setYear] = useState(filters.year || new Date().getFullYear())
    const [minAmount, setMinAmount] = useState(filters.minAmount || '')
    const [maxAmount, setMaxAmount] = useState(filters.maxAmount || '')
    const debouncedMinAmount = useDebounce(minAmount, 500)
    const debouncedMaxAmount = useDebounce(maxAmount, 500)

    const [sort, setSort] = useState({
        field: filters.sortBy || 'createdAt',
        direction: filters.sortOrder || 'desc',
    })

    const [showStats, setShowStats] = useState(false)
    const [openAddPanel, setOpenAddPanel] = useState(false)
    const [openExcelModal, setOpenExcelModal] = useState(false)
    const [openExportListModal, setOpenExportListModal] = useState(false)
    const [openDetailPanel, setOpenDetailPanel] = useState(false)
    const [openEditPanel, setOpenEditPanel] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState(null)

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadPayments()
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        status,
        grade,
        month,
        year,
        debouncedMinAmount,
        debouncedMaxAmount,
        sort.field,
        sort.direction,
    ])

    useEffect(() => {
        if (showStats) {
            loadStats()
        }
    }, [
        month,
        year,
        showStats
    ])

    /* ===================== API ===================== */
    const loadPayments = () => {
        dispatch(
            getTuitionPaymentsAsync({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                status: status || undefined,
                grade: grade || undefined,
                month: month || undefined,
                year: year || undefined,
                minAmount: debouncedMinAmount || undefined,
                maxAmount: debouncedMaxAmount || undefined,
                sortBy: sort.field,
                sortOrder: sort.direction,
            }),
        )
    }

    const loadStats = () => {
        dispatch(
            getTuitionPaymentStatsByMoneyAsync({
                month: month || undefined,
                year: year || undefined,
            }),
        )

        dispatch(
            getTuitionPaymentStatsByStatusAsync({
                month: month || undefined,
                year: year || undefined,
            }),
        )

        // Chỉ gọi monthly stats khi có year
        if (year) {
            dispatch(
                getTuitionPaymentStatsByMonthlyAsync({
                    year: Number(year),
                }),
            )
        }
    }

    /* ===================== HELPERS ===================== */
    const resetPageAndFilter = (payload) => {
        setCurrentPage(1)
        dispatch(setFilters(payload))
    }

    /* ===================== FILTER HANDLERS ===================== */
    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value)
        resetPageAndFilter({ search: value })
    }

    const handleStatusChange = (value) => {
        setStatus(value)
        resetPageAndFilter({ status: value })
    }

    const handleGradeChange = (value) => {
        setGrade(value)
        resetPageAndFilter({ grade: value })
    }

    const handleMinAmountChange = (value) => {
        setMinAmount(value)
        resetPageAndFilter({ minAmount: value })
    }

    const handleMaxAmountChange = (value) => {
        setMaxAmount(value)
        resetPageAndFilter({ maxAmount: value })
    }

    const handleMonthChange = (value) => {
        setMonth(value)
        resetPageAndFilter({ month: value })
    }

    const handleYearChange = (value) => {
        setYear(value)
        resetPageAndFilter({ year: value })
    }

    const handleSortChange = (field, direction) => {
        setSort({ field, direction })
        resetPageAndFilter({ sortBy: field, sortOrder: direction })
    }

    /* ===================== PAGINATION ===================== */
    const handlePageChange = (page) => setCurrentPage(page)

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    /* ===================== VIEW / EDIT / DELETE ===================== */
    const handleView = (payment) => {
        setSelectedPayment(payment)
        setOpenDetailPanel(true)
    }

    const handleEdit = (payment) => {
        setSelectedPayment(payment)
        setOpenEditPanel(true)
    }

    const handleDelete = (payment) => {
        setSelectedPayment(payment)
        setOpenDeleteModal(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedPayment) return

        try {
            await dispatch(deleteTuitionPaymentAsync(selectedPayment.paymentId)).unwrap()
            setOpenDeleteModal(false)
            setSelectedPayment(null)
            loadPayments()
        } catch (error) {
            console.error('Error deleting payment:', error)
        }
    }

    /* ===================== QUICK TOGGLE STATUS ===================== */
    const handleQuickToggleStatus = async (payment) => {
        const newStatus = payment.status === 'PAID' ? 'UNPAID' : 'PAID'
        
        try {
            const result = await dispatch(
                updateTuitionPaymentAsync({
                    id: payment.paymentId,
                    data: {
                        status: newStatus,
                    },
                })
            ).unwrap()

            // Cập nhật payment trong list thay vì load lại
            dispatch(updatePaymentInList(result.data))
            
            // Reload stats to update counts
            if (showStats) {
                loadStats()
            }
        } catch (error) {
            console.error('Error toggling payment status:', error)
        }
    }

    /* ===================== EXPORT LIST ===================== */
    const handleExportList = async (exportOptions) => {
        try {
            await dispatch(exportTuitionPaymentListAsync(exportOptions)).unwrap()
            setOpenExportListModal(false)
        } catch (error) {
            console.error('Error exporting payment list:', error)
        }
    }

    /* ===================== RENDER ===================== */
    return (
        <>
            {/* ===================== HEADER ===================== */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Quản lý học phí
                        </h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý và theo dõi tình trạng thu học phí.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline"
                            onClick={() => setOpenExportListModal(true)}
                        >
                            <Download size={16} />
                            Xuất Excel
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setOpenExcelModal(true)}
                        >
                            <Download size={16} />
                            Excel mẫu học phí
                        </Button>


                        <Button onClick={() => setOpenAddPanel(true)}>
                            <Plus size={16} />
                            Tạo học phí
                        </Button>
                    </div>
                </div>

                {/* ===================== FILTERS ===================== */}
                <TuitionPaymentFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    status={status}
                    onStatusChange={handleStatusChange}
                    grade={grade}
                    onGradeChange={handleGradeChange}
                    month={month}
                    onMonthChange={handleMonthChange}
                    year={year}
                    onYearChange={handleYearChange}
                    minAmount={minAmount}
                    onMinAmountChange={handleMinAmountChange}
                    maxAmount={maxAmount}
                    onMaxAmountChange={handleMaxAmountChange}
                    showStats={showStats}
                    onToggleStats={() => setShowStats(!showStats)}
                />

                {/* ===================== STATS ===================== */}
                {showStats && (
                    <div className="mt-4 animate-fade-in">
                        <TuitionPaymentStats loadStats={loadStats} />
                    </div>
                )}
            </div>

            {/* ===================== TABLE ===================== */}
            <div className="bg-white border border-border rounded-sm">
                <TuitionPaymentTable
                    payments={payments}
                    loading={loadingGet}
                    sort={sort}
                    onSortChange={handleSortChange}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onQuickToggle={handleQuickToggleStatus}
                />

                {/* ===================== PAGINATION + PANEL ===================== */}
                <div className="p-4 border-t border-border">
                    <RightPanel
                        isOpen={openDetailPanel}
                        onClose={() => {
                            setOpenDetailPanel(false)
                            setSelectedPayment(null)
                        }}
                        title="Chi tiết học phí"
                    >
                        {selectedPayment && (
                            <TuitionPaymentDetail payment={selectedPayment} />
                        )}
                    </RightPanel>

                    <RightPanel
                        isOpen={openEditPanel}
                        onClose={() => {
                            setOpenEditPanel(false)
                            setSelectedPayment(null)
                        }}
                        title="Chỉnh sửa học phí"
                    >
                        {selectedPayment && (
                            <EditTuitionPayment
                                payment={selectedPayment}
                                onClose={() => {
                                    setOpenEditPanel(false)
                                    setSelectedPayment(null)
                                }}
                                onSuccess={loadPayments}
                            />
                        )}
                    </RightPanel>

                    <RightPanel
                        isOpen={openAddPanel}
                        onClose={() => setOpenAddPanel(false)}
                        title="Tạo học phí"
                    >
                        <AddTuitionPayment
                            onClose={() => setOpenAddPanel(false)}
                            onSuccess={loadPayments}
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
            <ExportExcelModal
                isOpen={openExcelModal}
                onClose={() => setOpenExcelModal(false)}
            />

            {/* Export List Modal */}
            <ExportTuitionPaymentListModal
                isOpen={openExportListModal}
                onClose={() => setOpenExportListModal(false)}
                onConfirm={handleExportList}
                loading={loadingExportList}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title="Xác nhận xóa"
            >
                <div className="p-6">
                    <p className="text-foreground mb-4">
                        Bạn có chắc chắn muốn xóa học phí #{selectedPayment?.paymentId} không?
                    </p>
                    {selectedPayment && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-foreground-light">
                                Học sinh: <span className="font-medium text-foreground">{selectedPayment.student?.fullName}</span>
                            </p>
                            <p className="text-sm text-foreground-light">
                                Kỳ học phí: <span className="font-medium text-foreground">Tháng {selectedPayment.month}/{selectedPayment.year}</span>
                            </p>
                            <p className="text-sm text-foreground-light">
                                Số tiền: <span className="font-medium text-foreground">{selectedPayment.amount?.toLocaleString('vi-VN')} ₫</span>
                            </p>
                        </div>
                    )}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setOpenDeleteModal(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleConfirmDelete}
                        >
                            Xóa
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
