import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
    getMyCoursesAsync,
    deleteCourseAsync,
    setMyCoursesFilters,
    setMyCoursesPagination,
    selectMyCourses,
    selectMyCoursesLoadingGet,
    selectMyCoursesPagination,
    selectMyCoursesFilters,
} from '../store/courseSlice'
import { selectProfile } from '../../profile/store/profileSlice'

import { CourseList } from './CourseList'
import { useSearch } from '../../../shared/hooks'
import { ROUTES } from '../../../core/constants'
/**
 * MyCourseListPage
 * Container component – xử lý logic, data, routing
 */
export const MyCourseListPage = ({
    isMyCourses = true,
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const profile = useSelector(selectProfile)
    const teacherId = profile?.adminId || null
    /* ===================== REDUX STATE ===================== */
    const courses = useSelector(selectMyCourses)
    const loading = useSelector(selectMyCoursesLoadingGet)
    const pagination = useSelector(selectMyCoursesPagination)
    const filters = useSelector(selectMyCoursesFilters)

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    )

    const [openAddCourse, setOpenAddCourse] = useState(false)

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
            getMyCoursesAsync({
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
        dispatch(setMyCoursesPagination({ page: 1 }))
        dispatch(setMyCoursesFilters({ search: value }))
    }

    const handleGradeChange = (value) => {
        dispatch(setMyCoursesPagination({ page: 1 }))
        dispatch(setMyCoursesFilters({ grade: value }))
    }

    const handleVisibilityChange = (value) => {
        dispatch(setMyCoursesPagination({ page: 1 }))
        dispatch(setMyCoursesFilters({ visibility: value }))
    }

    const handleAcademicYearChange = (value) => {
        dispatch(setMyCoursesPagination({ page: 1 }))
        dispatch(setMyCoursesFilters({ academicYear: value }))
    }

    const handlePageChange = (page) => {
        dispatch(setMyCoursesPagination({ page }))
    }

    const handleItemsPerPageChange = (value) => {
        dispatch(setMyCoursesPagination({ limit: value, page: 1 }))
    }

    const handleView = (course) => {
        const path = ROUTES.COURSE_DETAIL(course.courseId)
        const query = isMyCourses ? '?from=my-courses' : ''
        navigate(path + query)
    }

    const handleEdit = (course) => {
        // navigate(ROUTES.COURSE_EDIT(course.courseId))
    }

    const handleDelete = async (course) => {
        if (!window.confirm(`Bạn có chắc muốn xóa khóa học "${course.title}"?`)) {
            return
        }

        try {
            await dispatch(deleteCourseAsync(course.courseId)).unwrap()
            loadCourses()
        } catch (error) {
            console.error('Delete course failed:', error)
        }
    }

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
        />
    )
}
