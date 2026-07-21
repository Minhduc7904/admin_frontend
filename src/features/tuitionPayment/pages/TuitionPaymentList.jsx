import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Download, Layers3 } from 'lucide-react'

import { Button, RightPanel } from '../../../shared/components'
import { Pagination, Modal } from '../../../shared/components/ui'
import { useSearch, useDebounce, useHasPermission } from '../../../shared/hooks'
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes'
import { createPaymentIntentForTuitionPaymentAsync, createPaymentIntentsForGradePeriodAsync, selectPaymentIntentCreatingBulk, selectPaymentIntentCreatingTuitionPaymentId } from '../../paymentIntent/store/paymentIntentSlice'

import {
    getTuitionPaymentsAsync,
    getTuitionPaymentByIdAsync,
    getTuitionPaymentStatsByMoneyAsync,
    getTuitionPaymentStatsByStatusAsync,
    getTuitionPaymentStatsByMonthlyAsync,
    deleteTuitionPaymentAsync,
    confirmManualTuitionPaymentAsync,
    updateManualTuitionPaymentReconciliationAsync,
    unreconcileManualTuitionPaymentAsync,
    exportTuitionPaymentListAsync,
    setFilters,
    selectTuitionPayments,
    selectCurrentTuitionPayment,
    selectTuitionPaymentPagination,
    selectTuitionPaymentLoadingGet,
    selectTuitionPaymentLoadingDetail,
    selectTuitionPaymentLoadingExportList,
    selectTuitionPaymentLoadingConfirmManualPayment,
    selectTuitionPaymentLoadingManualReconciliation,
    selectTuitionPaymentLoadingUnreconcileManualPayment,
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
    ManualTuitionPaymentModal,
    CreatePaymentIntentsBulkModal,
} from '../components'

export const TuitionPaymentList = () => {
    const dispatch = useDispatch()

    /* ===================== REDUX ===================== */
    const payments = useSelector(selectTuitionPayments)
    const currentPayment = useSelector(selectCurrentTuitionPayment)
    const loadingGet = useSelector(selectTuitionPaymentLoadingGet)
    const loadingDetail = useSelector(selectTuitionPaymentLoadingDetail)
    const loadingExportList = useSelector(selectTuitionPaymentLoadingExportList)
    const loadingConfirmManualPayment = useSelector(selectTuitionPaymentLoadingConfirmManualPayment)
    const loadingManualReconciliation = useSelector(selectTuitionPaymentLoadingManualReconciliation)
    const loadingUnreconcileManualPayment = useSelector(selectTuitionPaymentLoadingUnreconcileManualPayment)
    const creatingPaymentIntentId = useSelector(selectPaymentIntentCreatingTuitionPaymentId)
    const creatingPaymentIntentsBulk = useSelector(selectPaymentIntentCreatingBulk)
    const pagination = useSelector(selectTuitionPaymentPagination)
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
    const [openManualConfirmModal, setOpenManualConfirmModal] = useState(false)
    const [openManualReconciliationModal, setOpenManualReconciliationModal] = useState(false)
    const [openUnreconcileModal, setOpenUnreconcileModal] = useState(false)
    const [openPaymentIntentsBulkModal, setOpenPaymentIntentsBulkModal] = useState(false)
    const [reconciliationPayment, setReconciliationPayment] = useState(null)
    const [reconciliationTransactions, setReconciliationTransactions] = useState([])
    const [selectedPayment, setSelectedPayment] = useState(null)
    const canConfirmManual = useHasPermission(PERMISSIONS.TUITION_PAYMENT.CONFIRM_MANUAL_PAYMENT)
    const canSearchBankTransactions = useHasPermission(PERMISSIONS.BANK_TRANSFER_TRANSACTION.GET_ALL)
    const canCreatePaymentIntent = useHasPermission(PERMISSIONS.PAYMENT_INTENT.CREATE)

    /* ===================== API ===================== */
    function loadPayments() {
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

    function loadStats() {
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
        dispatch(getTuitionPaymentByIdAsync(payment.paymentId))
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
    const handleQuickToggleStatus = (payment) => {
        if (payment.status !== 'UNPAID') return
        setSelectedPayment(payment)
        setOpenManualConfirmModal(true)
    }

    const handleConfirmManualPayment = async (data) => {
        if (!selectedPayment) return

        try {
            await dispatch(confirmManualTuitionPaymentAsync({ id: selectedPayment.paymentId, data })).unwrap()
            setOpenManualConfirmModal(false)
            setSelectedPayment(null)
            loadPayments()
            if (showStats) loadStats()
        } catch (error) {
            console.error('Error confirming manual tuition payment:', error)
        }
    }

    const openManualReconciliation = (payment, transactions) => {
        setReconciliationPayment(payment)
        setReconciliationTransactions(transactions)
        setOpenManualReconciliationModal(true)
    }

    const openManualReconciliationFromList = async (payment) => {
        try {
            const response = await dispatch(getTuitionPaymentByIdAsync(payment.paymentId)).unwrap()
            const detail = response.data
            const transactions = detail.paymentIntent?.paymentAttempts?.flatMap(
                (attempt) => (attempt.bankTransferTransactions || []).filter(
                    (transaction) => transaction.reconciliationStatus === 'ADMIN',
                ),
            ) || []
            openManualReconciliation(detail, transactions)
        } catch (error) {
            console.error('Error loading manual reconciliation:', error)
        }
    }

    const updateManualReconciliation = async (data) => {
        if (!reconciliationPayment) return

        try {
            await dispatch(updateManualTuitionPaymentReconciliationAsync({
                id: reconciliationPayment.paymentId,
                data,
            })).unwrap()
            setOpenManualReconciliationModal(false)
            await dispatch(getTuitionPaymentByIdAsync(reconciliationPayment.paymentId)).unwrap()
            loadPayments()
            if (showStats) loadStats()
        } catch (error) {
            console.error('Error updating manual reconciliation:', error)
        }
    }

    const openUnreconcile = (payment) => {
        setReconciliationPayment(payment)
        setOpenUnreconcileModal(true)
    }

    const unreconcileManualPayment = async () => {
        if (!reconciliationPayment) return

        try {
            await dispatch(unreconcileManualTuitionPaymentAsync(reconciliationPayment.paymentId)).unwrap()
            setOpenUnreconcileModal(false)
            await dispatch(getTuitionPaymentByIdAsync(reconciliationPayment.paymentId)).unwrap()
            loadPayments()
            if (showStats) loadStats()
        } catch (error) {
            console.error('Error unreconciling manual payment:', error)
        }
    }

    const createPaymentIntent = async (payment) => {
        try {
            await dispatch(createPaymentIntentForTuitionPaymentAsync(payment.paymentId)).unwrap()
            await dispatch(getTuitionPaymentByIdAsync(payment.paymentId)).unwrap()
            loadPayments()
        } catch (error) {
            console.error('Error creating payment intent:', error)
        }
    }

    const createPaymentIntentsBulk = async (data) => {
        try {
            await dispatch(createPaymentIntentsForGradePeriodAsync(data)).unwrap()
            setOpenPaymentIntentsBulkModal(false)
            loadPayments()
        } catch (error) {
            console.error('Error creating payment intents in bulk:', error)
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
                        {canCreatePaymentIntent && <Button variant="outline" onClick={() => setOpenPaymentIntentsBulkModal(true)}>
                            <Layers3 size={16} />
                            Tạo intent hàng loạt
                        </Button>}
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
                    canConfirmManual={canConfirmManual}
                    onEditManualReconciliation={openManualReconciliationFromList}
                    onUnreconcileManualPayment={openUnreconcile}
                    canCreatePaymentIntent={canCreatePaymentIntent}
                    onCreatePaymentIntent={createPaymentIntent}
                    creatingPaymentIntentId={creatingPaymentIntentId}
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
                        <TuitionPaymentDetail
                            payment={selectedPayment}
                            detail={currentPayment}
                            loading={loadingDetail}
                            canManageManualReconciliation={canConfirmManual}
                            onEditManualReconciliation={openManualReconciliation}
                            onUnreconcileManualPayment={openUnreconcile}
                            reconciliationLoading={loadingManualReconciliation || loadingUnreconcileManualPayment}
                            canCreatePaymentIntent={canCreatePaymentIntent}
                            onCreatePaymentIntent={createPaymentIntent}
                            creatingPaymentIntent={creatingPaymentIntentId === (currentPayment || selectedPayment)?.paymentId}
                        />
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

            <CreatePaymentIntentsBulkModal
                key={`payment-intents-bulk-${openPaymentIntentsBulkModal}`}
                isOpen={openPaymentIntentsBulkModal}
                onClose={() => setOpenPaymentIntentsBulkModal(false)}
                onConfirm={createPaymentIntentsBulk}
                loading={creatingPaymentIntentsBulk}
                initialValues={{ grade, month, year }}
            />

            <ManualTuitionPaymentModal
                key={selectedPayment?.paymentId || 'no-payment'}
                payment={selectedPayment}
                isOpen={openManualConfirmModal}
                onClose={() => {
                    setOpenManualConfirmModal(false)
                    setSelectedPayment(null)
                }}
                onConfirm={handleConfirmManualPayment}
                loading={loadingConfirmManualPayment}
                canSearchTransactions={canSearchBankTransactions}
            />

            <ManualTuitionPaymentModal
                key={`reconciliation-${reconciliationPayment?.paymentId || 'no-payment'}`}
                payment={reconciliationPayment}
                isOpen={openManualReconciliationModal}
                onClose={() => {
                    setOpenManualReconciliationModal(false)
                    setReconciliationPayment(null)
                    setReconciliationTransactions([])
                }}
                onConfirm={updateManualReconciliation}
                loading={loadingManualReconciliation}
                canSearchTransactions={canSearchBankTransactions}
                mode="edit"
                initialTransactions={reconciliationTransactions}
            />

            <Modal
                isOpen={openUnreconcileModal}
                onClose={() => !loadingUnreconcileManualPayment && setOpenUnreconcileModal(false)}
                title="Bỏ đối soát thủ công"
            >
                <div className="p-6">
                    <p className="text-foreground">Bạn có chắc muốn bỏ đối soát học phí #{reconciliationPayment?.paymentId}?</p>
                    <p className="mt-2 text-sm text-foreground-light">Học phí sẽ trở lại chưa đóng; các giao dịch ngân hàng đã gắn được giữ làm lịch sử nhưng trở về chưa đối soát.</p>
                    <div className="mt-5 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setOpenUnreconcileModal(false)} disabled={loadingUnreconcileManualPayment}>Hủy</Button>
                        <Button variant="danger" onClick={unreconcileManualPayment} loading={loadingUnreconcileManualPayment}>Bỏ đối soát</Button>
                    </div>
                </div>
            </Modal>

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
