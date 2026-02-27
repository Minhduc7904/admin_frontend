import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
    getAllCoursesAsync,
    deleteCourseAsync,
    setFilters,
    setPagination,
    selectCourses,
    selectCourseLoadingGet,
    selectCoursePagination,
    selectCourseFilters,
} from '../store/courseSlice'

import { CourseList } from '../pages/CourseList'
import { useSearch } from '../../../shared/hooks'
import { ROUTES } from '../../../core/constants'

/**
 * CourseListPage
 * Container component – xử lý logic, data, routing
 */
export const CourseListPage = ({
    teacherId = null,
    isMyCourses = false,
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* ===================== REDUX STATE ===================== */
    const courses = useSelector(selectCourses)
    const loading = useSelector(selectCourseLoadingGet)
    const pagination = useSelector(selectCoursePagination)
    const filters = useSelector(selectCourseFilters)

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    )

    const [openAddCourse, setOpenAddCourse] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

    // Lấy từ slice thay vì state local
    const grade = filters.grade || ''
    const currentPage = pagination.page
    const itemsPerPage = pagination.limit
    const visibility = filters.visibility || ''
    const academicYear = filters.academicYear || ''

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadCourses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        grade,
        visibility,
        academicYear,
        teacherId,
    ])

    /* ===================== DATA ===================== */
    const loadCourses = () => {
        dispatch(
            getAllCoursesAsync({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                grade: grade || undefined,
                visibility: visibility || undefined,
                academicYear: academicYear || undefined,
                teacherId: teacherId || undefined,
            }),
        )
    }

    /* ===================== HANDLERS ===================== */
    const handleSearch = (value) => {
        handleSearchChange(value)
        dispatch(setPagination({ page: 1 }))
        dispatch(setFilters({ search: value }))
    }

    const handleGradeChange = (value) => {
        dispatch(setPagination({ page: 1 }))
        dispatch(setFilters({ grade: value }))
    }

    const handleVisibilityChange = (value) => {
        dispatch(setPagination({ page: 1 }))
        dispatch(setFilters({ visibility: value }))
    }

    const handleAcademicYearChange = (value) => {
        dispatch(setPagination({ page: 1 }))
        dispatch(setFilters({ academicYear: value }))
    }

    const handlePageChange = (page) => {
        dispatch(setPagination({ page }))
    }

    const handleItemsPerPageChange = (value) => {
        dispatch(setPagination({ limit: value, page: 1 }))
    }

    const handleView = (course) => {
        const path = ROUTES.COURSE_DETAIL(course.courseId)
        const query = isMyCourses ? '?from=my-courses' : ''
        navigate(path + query)
    }

    const handleEdit = () => {}

    const handleDelete = (course) => {
        setDeleteTarget(course)
    }

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return
        try {
            await dispatch(deleteCourseAsync(deleteTarget.courseId)).unwrap()
            loadCourses()
        } catch (error) {
            console.error('Delete course failed:', error)
        } finally {
            setDeleteTarget(null)
        }
    }

    const handleCloseDeleteModal = () => setDeleteTarget(null)

    /* ===================== ADD COURSE ===================== */
    const openAdd = () => setOpenAddCourse(true)
    const closeAdd = () => setOpenAddCourse(false)

    /* ===================== RENDER ===================== */
    return (
        <CourseList
            title={isMyCourses ? 'Khóa học của tôi' : 'Quản lý khóa học'}
            subtitle={
                isMyCourses
                    ? 'Danh sách khóa học bạn đang giảng dạy.'
                    : 'Quản lý danh sách khóa học trong hệ thống.'
            }
            isMyCourses={isMyCourses}
            teacherId={teacherId}
            canSelectTeacher={!isMyCourses}

            loadCourses={loadCourses}

            /* data */
            courses={courses}
            loading={loading}
            pagination={pagination}

            /* filters */
            search={search}
            grade={grade}
            visibility={visibility}
            academicYear={academicYear}

            /* pagination */
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}

            /* ui */
            openAddCourse={openAddCourse}

            /* handlers */
            onSearchChange={handleSearch}
            onGradeChange={handleGradeChange}
            onVisibilityChange={handleVisibilityChange}
            onAcademicYearChange={handleAcademicYearChange}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenAddCourse={openAdd}
            onCloseAddCourse={closeAdd}
            deleteTarget={deleteTarget}
            openDeleteModal={!!deleteTarget}
            onCloseDeleteModal={handleCloseDeleteModal}
            onConfirmDelete={handleConfirmDelete}
        />
    )
}
