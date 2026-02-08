import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
    getMyQuestionsAsync,
    deleteQuestionAsync,
    setFilters,
    setPagination,
    clearCurrentQuestion,
} from '../store/questionSlice'

import { QuestionList } from './QuestionList'
import { useSearch } from '../../../shared/hooks'

/**
 * MyQuestionListPage
 * Container component – xử lý logic, data, routing cho câu hỏi của tôi
 */
export const MyQuestionListPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* ===================== REDUX STATE ===================== */
    const questions = useSelector((state) => state.question.questions)
    const loading = useSelector((state) => state.question.loadingGet)
    const pagination = useSelector((state) => state.question.pagination)
    const filters = useSelector((state) => state.question.filters)

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    )

    const [openAddQuestion, setOpenAddQuestion] = useState(false)
    const [viewQuestionId, setViewQuestionId] = useState(null)
    const [openViewQuestion, setOpenViewQuestion] = useState(false)
    const [editQuestionId, setEditQuestionId] = useState(null)
    const [openEditQuestion, setOpenEditQuestion] = useState(false)
    const [deleteQuestion, setDeleteQuestion] = useState(null)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    // Lấy từ filters và pagination
    const grade = filters.grade || ''
    const visibility = filters.visibility || ''
    const difficulty = filters.difficulty || ''
    const type = filters.type || ''
    const subjectId = filters.subjectId || ''
    const currentPage = pagination.page
    const itemsPerPage = pagination.limit

    const [sort, setSort] = useState({
        field: filters.sortBy || 'createdAt',
        direction: filters.sortOrder || 'desc',
    })

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadQuestions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        grade,
        visibility,
        difficulty,
        type,
        subjectId,
        sort.field,
        sort.direction,
    ])

    /* ===================== DATA ===================== */
    const loadQuestions = () => {
        dispatch(
            getMyQuestionsAsync({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                grade: grade || undefined,
                visibility: visibility || undefined,
                difficulty: difficulty || undefined,
                type: type || undefined,
                subjectId: subjectId || undefined,
                sortBy: sort.field,
                sortOrder: sort.direction,
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

    const handleDifficultyChange = (value) => {
        dispatch(setFilters({ difficulty: value }))
        dispatch(setPagination({ page: 1 }))
    }

    const handleTypeChange = (value) => {
        dispatch(setFilters({ type: value }))
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

    const handleSortChange = (field, direction) => {
        setSort({ field, direction })
        dispatch(setFilters({ sortBy: field, sortOrder: direction }))
    }

    const handleView = (question) => {
        setViewQuestionId(question.questionId)
        setOpenViewQuestion(true)
    }

    const handleEdit = (question) => {
        setEditQuestionId(question.questionId)
        setOpenEditQuestion(true)
    }

    const handleDelete = (question) => {
        setDeleteQuestion(question)
        setOpenDeleteModal(true)
    }

    const handleConfirmDelete = async () => {
        if (!deleteQuestion) return

        try {
            await dispatch(deleteQuestionAsync(deleteQuestion.questionId)).unwrap()
            setOpenDeleteModal(false)
            setDeleteQuestion(null)
            loadQuestions()
        } catch (error) {
            console.error('Delete question failed:', error)
        }
    }

    /* ===================== ADD QUESTION ===================== */
    const openAdd = () => setOpenAddQuestion(true)
    const closeAdd = () => setOpenAddQuestion(false)

    /* ===================== VIEW QUESTION ===================== */
    const closeView = () => {
        setOpenViewQuestion(false)
        setViewQuestionId(null)
    }

    /* ===================== EDIT QUESTION ===================== */
    const closeEdit = () => {
        setOpenEditQuestion(false)
        setEditQuestionId(null)
    }

    /* ===================== DELETE QUESTION ===================== */
    const closeDelete = () => {
        setOpenDeleteModal(false)
        setDeleteQuestion(null)
    }

    /* ===================== RENDER ===================== */
    return (
        <QuestionList
            title="Câu hỏi của tôi"
            subtitle="Quản lý danh sách câu hỏi do bạn tạo."
            
            loadQuestions={loadQuestions}

            /* data */
            questions={questions}
            loading={loading}
            pagination={pagination}

            /* filters */
            search={search}
            grade={grade}
            visibility={visibility}
            difficulty={difficulty}
            type={type}
            subjectId={subjectId}

            /* pagination */
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}

            /* sort */
            sort={sort}

            /* ui */
            openAddQuestion={openAddQuestion}
            openViewQuestion={openViewQuestion}
            viewQuestionId={viewQuestionId}
            openEditQuestion={openEditQuestion}
            editQuestionId={editQuestionId}
            openDeleteModal={openDeleteModal}
            deleteQuestion={deleteQuestion}

            /* handlers */
            onSearchChange={handleSearch}
            onGradeChange={handleGradeChange}
            onVisibilityChange={handleVisibilityChange}
            onDifficultyChange={handleDifficultyChange}
            onTypeChange={handleTypeChange}
            onSubjectIdChange={handleSubjectIdChange}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onSortChange={handleSortChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenAddQuestion={openAdd}
            onCloseAddQuestion={closeAdd}
            onCloseViewQuestion={closeView}
            onCloseEditQuestion={closeEdit}
            onCloseDeleteModal={closeDelete}
            onConfirmDelete={handleConfirmDelete}
        />
    )
}
