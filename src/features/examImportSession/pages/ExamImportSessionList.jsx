import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { Button } from '../../../shared/components'
import {
    getExamImportSessionsAsync,
    createExamImportSessionAsync,
    setFilters,
    selectExamImportSessions,
    selectExamImportSessionLoadingGet,
    selectExamImportSessionPagination,
    selectExamImportSessionFilters,
} from '../store/examImportSessionSlice'

import { useSearch } from '../../../shared/hooks'
import {
    ExamImportSessionFilters,
    ExamImportSessionCard,
} from '../components'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { ROUTES } from '../../../core/constants'

export const ExamImportSessionList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* ===================== REDUX ===================== */
    const sessions = useSelector(selectExamImportSessions)
    const loadingGet = useSelector(selectExamImportSessionLoadingGet)
    const pagination = useSelector(selectExamImportSessionPagination)
    const filters = useSelector(selectExamImportSessionFilters)

    /* ===================== SEARCH ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    )

    /* ===================== LOCAL STATE ===================== */
    const [currentPage, setCurrentPage] = useState(pagination.page || 1)
    const [itemsPerPage, setItemsPerPage] = useState(pagination.limit || 10)

    const [sort, setSort] = useState({
        field: filters.sortBy || 'createdAt',
        direction: filters.sortOrder || 'desc',
    })

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadSessions()
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        sort.field,
        sort.direction,
    ])

    /* ===================== API ===================== */
    const loadSessions = () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
            sortBy: sort.field,
            sortOrder: sort.direction,
        }

        dispatch(getExamImportSessionsAsync(params))
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

    /* ===================== PAGINATION ===================== */
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    /* ===================== ACTIONS ===================== */
    const handleViewSession = (session) => {
        navigate(ROUTES.EXAM_IMPORT_SESSION_DETAIL(session.sessionId))
    }

    const handleAddNewSession = async () => {
        const result = await dispatch(createExamImportSessionAsync())
        if (result.payload && result.payload.data) {
            const newSessionId = result.payload.data.sessionId
            navigate(ROUTES.EXAM_IMPORT_SESSION_DETAIL(newSessionId))
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
                            Quản lý phiên import đề thi
                        </h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý các phiên import đề thi trong hệ thống.
                        </p>
                    </div>
                </div>

                {/* ===================== FILTERS ===================== */}
                <ExamImportSessionFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                />
            </div>

            {/* ===================== GRID CARDS ===================== */}
            <div className="bg-white border border-border rounded-sm p-6">
                {loadingGet ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="text-sm text-foreground-light">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                            {/* Add Card */}
                            <div
                                onClick={handleAddNewSession}
                                className="group relative aspect-square bg-white border-[3px] border-dashed border-gray-300 hover:border-gray-400 rounded-xl hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                    <div className="w-16 h-16 rounded-full border-[3px] border-dashed border-gray-300 group-hover:border-gray-400 flex items-center justify-center mb-4 transition-all">
                                        <Plus className="text-gray-400 group-hover:text-gray-400 transition-colors" size={40} strokeWidth={2.5} />
                                    </div>
                                    <p className="font-semibold text-gray-700 group-hover:text-gray-400 transition-colors text-center">
                                        Tạo Session Mới
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 text-center">
                                        Thêm phiên import
                                    </p>
                                </div>
                            </div>

                            {/* Session Cards */}
                            {sessions.map((session) => (
                                <ExamImportSessionCard
                                    key={session.sessionId}
                                    session={session}
                                    onClick={handleViewSession}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {!loadingGet && sessions.length === 0 && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground-lighter mb-4">
                                    <Plus className="text-foreground-light" size={32} />
                                </div>
                                <p className="text-foreground-light">
                                    Chưa có session nào. Tạo session đầu tiên!
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* ===================== PAGINATION ===================== */}
                {!loadingGet && sessions.length > 0 && (
                    <div className="pt-4 border-t border-border">
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
                )}
            </div>
        </>
    )
}
