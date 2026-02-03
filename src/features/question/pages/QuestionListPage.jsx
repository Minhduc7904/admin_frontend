import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
    getAllQuestionsAsync,
    deleteQuestionAsync,
    setFilters,
    clearCurrentQuestion,
} from '../store/questionSlice'

import { QuestionList } from './QuestionList'
import { useSearch } from '../../../shared/hooks'

/**
 * QuestionListPage
 * Container component – xử lý logic, data, routing
 */
export const QuestionListPage = () => {
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

    // Lấy từ filters và pagination
    const grade = filters.grade || ''
    const visibility = filters.visibility || ''
    const difficulty = filters.difficulty || ''
    const type = filters.type || ''
    const subjectId = filters.subjectId || ''
    const currentPage = pagination.page
    const itemsPerPage = pagination.limit

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
    ])

    /* ===================== DATA ===================== */
    const loadQuestions = () => {
        dispatch(
            getAllQuestionsAsync({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                grade: grade || undefined,
                visibility: visibility || undefined,
                difficulty: difficulty || undefined,
                type: type || undefined,
                subjectId: subjectId || undefined,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            }),
        )
    }

    /* ===================== HANDLERS ===================== */
    const handleSearch = (value) => {
        handleSearchChange(value)
        dispatch(setFilters({ search: value, page: 1 }))
    }

    const handleGradeChange = (value) => {
        dispatch(setFilters({ grade: value, page: 1 }))
    }

    const handleVisibilityChange = (value) => {
        dispatch(setFilters({ visibility: value, page: 1 }))
    }

    const handleDifficultyChange = (value) => {
        dispatch(setFilters({ difficulty: value, page: 1 }))
    }

    const handleTypeChange = (value) => {
        dispatch(setFilters({ type: value, page: 1 }))
    }

    const handleSubjectIdChange = (value) => {
        dispatch(setFilters({ subjectId: value, page: 1 }))
    }

    const handlePageChange = (page) => {
        dispatch(setFilters({ page }))
    }

    const handleItemsPerPageChange = (value) => {
        dispatch(setFilters({ limit: value, page: 1 }))
    }

    const handleView = (question) => {
        setViewQuestionId(question.questionId)
        setOpenViewQuestion(true)
    }

    const handleEdit = (question) => {
        // TODO: Navigate to question edit page or open edit modal
        console.log('Edit question:', question)
    }

    const handleDelete = async (question) => {
        if (!window.confirm(`Bạn có chắc muốn xóa câu hỏi "${question.content}"?`)) {
            return
        }

        try {
            await dispatch(deleteQuestionAsync(question.questionId)).unwrap()
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

    /* ===================== RENDER ===================== */
    return (
        <QuestionList
            title="Quản lý câu hỏi"
            subtitle="Quản lý danh sách câu hỏi trong hệ thống."
            
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

            /* ui */
            openAddQuestion={openAddQuestion}
            openViewQuestion={openViewQuestion}
            viewQuestionId={viewQuestionId}

            /* handlers */
            onSearchChange={handleSearch}
            onGradeChange={handleGradeChange}
            onVisibilityChange={handleVisibilityChange}
            onDifficultyChange={handleDifficultyChange}
            onTypeChange={handleTypeChange}
            onSubjectIdChange={handleSubjectIdChange}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenAddQuestion={openAdd}
            onCloseAddQuestion={closeAdd}
            onCloseViewQuestion={closeView}
        />
    )
}
