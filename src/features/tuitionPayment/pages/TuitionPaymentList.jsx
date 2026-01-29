import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Download } from 'lucide-react'

import { Button, RightPanel } from '../../../shared/components'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { useSearch } from '../../../shared/hooks'

import {
    getTuitionPaymentsAsync,
    getTuitionPaymentStatsByMoneyAsync,
    getTuitionPaymentStatsByStatusAsync,
    setFilters,
    selectTuitionPayments,
    selectTuitionPaymentPagination,
    selectTuitionPaymentLoadingGet,
    selectTuitionPaymentStatsByMoney,
    selectTuitionPaymentStatsByStatus,
    selectTuitionPaymentFilters,
} from '../store/tuitionPaymentSlice'

import {
    TuitionPaymentFilters,
    TuitionPaymentTable,
    // TuitionPaymentStats,
    AddTuitionPayment,
    ExportExcelModal,
} from '../components'

export const TuitionPaymentList = () => {
    const dispatch = useDispatch()

    /* ===================== REDUX ===================== */
    const payments = useSelector(selectTuitionPayments)
    const loadingGet = useSelector(selectTuitionPaymentLoadingGet)
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
    const [month, setMonth] = useState(filters.month || '')
    const [year, setYear] = useState(filters.year || '')

    const [sort, setSort] = useState({
        field: filters.sortBy || 'createdAt',
        direction: filters.sortOrder || 'desc',
    })

    const [showStats, setShowStats] = useState(true)
    const [openAddPanel, setOpenAddPanel] = useState(false)
    const [openExcelModal, setOpenExcelModal] = useState(false)

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadPayments()
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        status,
        month,
        year,
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
                month: month || undefined,
                year: year || undefined,
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
                        <Button variant="outline">
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
                    month={month}
                    onMonthChange={handleMonthChange}
                    year={year}
                    onYearChange={handleYearChange}
                    showStats={showStats}
                    onToggleStats={() => setShowStats(!showStats)}
                />

                {/* ===================== STATS ===================== */}
                {showStats && (
                    <div className="mt-4 animate-fade-in">
                        {/* <TuitionPaymentStats
                            money={statsMoney}
                            status={statsStatus}
                        /> */}
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
                />

                {/* ===================== PAGINATION + PANEL ===================== */}
                <div className="p-4 border-t border-border">
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
        </>
    )
}
