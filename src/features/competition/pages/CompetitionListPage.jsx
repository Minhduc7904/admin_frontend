import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
    getAllCompetitionsAsync,
    deleteCompetitionAsync,
    setFilters,
    setPagination,
    clearCurrentCompetition,
} from '../store/competitionSlice'

import { CompetitionList } from './CompetitionList'
import { useSearch } from '../../../shared/hooks'
import { ROUTES } from '../../../core/constants'

/**
 * CompetitionListPage
 * Container component – xử lý logic, data, routing
 */
export const CompetitionListPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* ===================== REDUX STATE ===================== */
    const competitions = useSelector((state) => state.competition.competitions)
    const loading = useSelector((state) => state.competition.loadingGet)
    const pagination = useSelector((state) => state.competition.pagination)
    const filters = useSelector((state) => state.competition.filters)

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    )

    const [openAddCompetition, setOpenAddCompetition] = useState(false)
    const [openEditCompetition, setOpenEditCompetition] = useState(false)
    const [openLeaderboard, setOpenLeaderboard] = useState(false)
    const [selectedCompetitionId, setSelectedCompetitionId] = useState(null)
    const [selectedCompetitionForLeaderboard, setSelectedCompetitionForLeaderboard] = useState(null)

    // Lấy từ filters và pagination
    const visibility = filters.visibility || ''
    const examId = filters.examId || ''
    const currentPage = pagination.page
    const itemsPerPage = pagination.limit

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadCompetitions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        visibility,
        examId,
    ])

    /* ===================== DATA ===================== */
    const loadCompetitions = () => {
        dispatch(
            getAllCompetitionsAsync({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                visibility: visibility || undefined,
                examId: examId || undefined,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            }),
        )
    }

    /* ===================== HANDLERS ===================== */
    const handleSearch = (value) => {
        handleSearchChange(value)
        dispatch(setFilters({ search: value }))
        dispatch(setPagination({ page: 1 }))
    }

    const handleVisibilityChange = (value) => {
        dispatch(setFilters({ visibility: value }))
        dispatch(setPagination({ page: 1 }))
    }

    const handleExamIdChange = (value) => {
        dispatch(setFilters({ examId: value }))
        dispatch(setPagination({ page: 1 }))
    }

    const handlePageChange = (page) => {
        dispatch(setPagination({ page }))
    }

    const handleItemsPerPageChange = (value) => {
        dispatch(setPagination({ limit: value, page: 1 }))
    }

    const handleView = (competition) => {
        // TODO: Navigate to competition detail page
        console.log('View competition:', competition)
    }

    const handleEdit = (competition) => {
        setSelectedCompetitionId(competition.competitionId)
        setOpenEditCompetition(true)
    }

    const handleViewLeaderboard = (competition) => {
        setSelectedCompetitionForLeaderboard(competition)
        setOpenLeaderboard(true)
    }

    const handleDelete = async (competition) => {
        if (!window.confirm(`Bạn có chắc muốn xóa cuộc thi "${competition.title}"?`)) {
            return
        }

        try {
            await dispatch(deleteCompetitionAsync(competition.competitionId)).unwrap()
            loadCompetitions()
        } catch (error) {
            console.error('Delete competition failed:', error)
        }
    }

    /* ===================== ADD COMPETITION ===================== */
    const openAdd = () => setOpenAddCompetition(true)
    const closeAdd = () => setOpenAddCompetition(false)

    /* ===================== EDIT COMPETITION ===================== */
    const closeEdit = () => {
        setOpenEditCompetition(false)
        setSelectedCompetitionId(null)
    }

    /* ===================== LEADERBOARD ===================== */
    const closeLeaderboard = () => {
        setOpenLeaderboard(false)
        setSelectedCompetitionForLeaderboard(null)
    }

    /* ===================== RENDER ===================== */
    return (
        <CompetitionList
            title="Quản lý cuộc thi"
            subtitle="Quản lý danh sách cuộc thi trong hệ thống."

            loadCompetitions={loadCompetitions}

            /* data */
            competitions={competitions}
            loading={loading}
            pagination={pagination}

            /* filters */
            search={search}
            visibility={visibility}
            examId={examId}

            /* pagination */
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}

            /* ui state */
            openAddCompetition={openAddCompetition}
            openEditCompetition={openEditCompetition}
            openLeaderboard={openLeaderboard}
            selectedCompetitionId={selectedCompetitionId}
            selectedCompetitionForLeaderboard={selectedCompetitionForLeaderboard}

            /* handlers */
            onSearchChange={handleSearch}
            onVisibilityChange={handleVisibilityChange}
            onExamIdChange={handleExamIdChange}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewLeaderboard={handleViewLeaderboard}
            onOpenAddCompetition={openAdd}
            onCloseAddCompetition={closeAdd}
            onCloseEditCompetition={closeEdit}
            onCloseLeaderboard={closeLeaderboard}
        />
    )
}
