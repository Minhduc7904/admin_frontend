import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
    getAllExamsAsync,
    deleteExamAsync,
    setFilters,
    setPagination,
    clearCurrentExam,
} from '../store/examSlice'

import { ExamList } from './ExamList'
import { useSearch } from '../../../shared/hooks'
import { ROUTES } from '../../../core/constants'

/**
 * ExamListPage
 * Container component – xử lý logic, data, routing
 */
export const ExamListPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* ===================== REDUX STATE ===================== */
    const exams = useSelector((state) => state.exam.exams)
    const loading = useSelector((state) => state.exam.loadingGet)
    const pagination = useSelector((state) => state.exam.pagination)
    const filters = useSelector((state) => state.exam.filters)

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    )

    const [openAddExam, setOpenAddExam] = useState(false)

    // Lấy từ filters và pagination
    const grade = filters.grade || ''
    const visibility = filters.visibility || ''
    const subjectId = filters.subjectId || ''
    const currentPage = pagination.page
    const itemsPerPage = pagination.limit

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadExams()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        grade,
        visibility,
        subjectId,
    ])

    /* ===================== DATA ===================== */
    const loadExams = () => {
        dispatch(
            getAllExamsAsync({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                grade: grade || undefined,
                visibility: visibility || undefined,
                subjectId: subjectId || undefined,
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

    const handleGradeChange = (value) => {
        dispatch(setFilters({ grade: value }))
        dispatch(setPagination({ page: 1 }))
    }

    const handleVisibilityChange = (value) => {
        dispatch(setFilters({ visibility: value }))
        dispatch(setPagination({ page: 1 }))
    }

    const handleSubjectIdChange = (value) => {
        dispatch(setFilters({ subjectId: value }))
        dispatch(setPagination({ page: 1 }))
    }

    const handlePageChange = (page) => {
        dispatch(setPagination({ page }))
    }

    const handleItemsPerPageChange = (value) => {
        dispatch(setPagination({ limit: value, page: 1 }))
    }

    const handleView = (exam) => {
        navigate(ROUTES.EXAM_DETAIL(exam.examId))
    }

    const handleEdit = (exam) => {
        // TODO: Navigate to exam edit page or open edit modal
        console.log('Edit exam:', exam)
    }

    const handleDelete = async (exam) => {
        if (!window.confirm(`Bạn có chắc muốn xóa đề thi "${exam.title}"?`)) {
            return
        }

        try {
            await dispatch(deleteExamAsync(exam.examId)).unwrap()
            loadExams()
        } catch (error) {
            console.error('Delete exam failed:', error)
        }
    }

    /* ===================== ADD EXAM ===================== */
    const openAdd = () => setOpenAddExam(true)
    const closeAdd = () => setOpenAddExam(false)

    /* ===================== RENDER ===================== */
    return (
        <ExamList
            title="Quản lý đề thi"
            subtitle="Quản lý danh sách đề thi trong hệ thống."
            
            loadExams={loadExams}

            /* data */
            exams={exams}
            loading={loading}
            pagination={pagination}

            /* filters */
            search={search}
            grade={grade}
            visibility={visibility}
            subjectId={subjectId}

            /* pagination */
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}

            /* ui */
            openAddExam={openAddExam}

            /* handlers */
            onSearchChange={handleSearch}
            onGradeChange={handleGradeChange}
            onVisibilityChange={handleVisibilityChange}
            onSubjectIdChange={handleSubjectIdChange}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenAddExam={openAdd}
            onCloseAddExam={closeAdd}
        />
    )
}
