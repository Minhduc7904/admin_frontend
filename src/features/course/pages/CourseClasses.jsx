import { useEffect, useState } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentCourse, selectCourseLoadingGet } from '../store/courseSlice';
import {
    getAllCourseClassesAsync,
    deleteCourseClassAsync,
    setFilters,
    setPagination,
    selectCourseClasses,
    selectCourseClassLoadingGet,
    selectCourseClassPagination,
    selectCourseClassFilters,
} from '../../courseClass/store/courseClassSlice';
import { ClassList } from '../../courseClass/pages/ClassList';
import { useSearch } from '../../../shared/hooks';

/**
 * CourseClasses - Container component cho danh sách lớp học của một khóa học
 */
export const CourseClasses = () => {
    const { id } = useParams();
    const courseId = Number(id);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const course = useSelector(selectCurrentCourse);
    const courseLoading = useSelector(selectCourseLoadingGet);
    const { isMyCourses = false } = useOutletContext() || {};

    /* ===================== REDUX STATE ===================== */
    const classes = useSelector(selectCourseClasses);
    const loading = useSelector(selectCourseClassLoadingGet);
    const pagination = useSelector(selectCourseClassPagination);
    const filters = useSelector(selectCourseClassFilters);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    );

    const [isActive, setIsActive] = useState('');
    const [openAddClass, setOpenAddClass] = useState(false);

    // Lấy từ slice thay vì state local
    const currentPage = pagination.page;
    const itemsPerPage = pagination.limit;

    const invalidId = isNaN(courseId) || courseId <= 0;

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        if (!invalidId && !courseLoading) {
            loadClasses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        isActive,
        courseId,
    ]);

    /* ===================== DATA ===================== */
    const loadClasses = () => {
        dispatch(
            getAllCourseClassesAsync({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
                courseId: courseId || undefined,
            }),
        );
    };

    /* ===================== HANDLERS ===================== */
    const handleSearch = (value) => {
        handleSearchChange(value);
        dispatch(setPagination({ page: 1 }));
        dispatch(setFilters({ search: value }));
    };

    const handleIsActiveChange = (value) => {
        setIsActive(value);
        dispatch(setPagination({ page: 1 }));
    };

    const handlePageChange = (page) => {
        dispatch(setPagination({ page }));
    };

    const handleItemsPerPageChange = (value) => {
        dispatch(setPagination({ limit: value, page: 1 }));
    };

    const handleView = (classItem) => {
        if (!classItem) return;
        const queryString = `?from=course-${courseId}`;
        navigate(ROUTES.CLASS_DETAIL(classItem.classId) + queryString);
    };

    const handleEdit = (classItem) => {
        // navigate(ROUTES.CLASS_EDIT(classItem.classId));
    };

    const handleDelete = async (classItem) => {
        if (!window.confirm(`Bạn có chắc muốn xóa lớp học "${classItem.className}"?`)) {
            return;
        }

        try {
            await dispatch(deleteCourseClassAsync(classItem.classId)).unwrap();
            loadClasses();
        } catch (error) {
            console.error('Delete class failed:', error);
        }
    };

    /* ===================== ADD CLASS ===================== */
    const openAdd = () => setOpenAddClass(true);
    const closeAdd = () => setOpenAddClass(false);

    /* ===================== RENDER ===================== */
    return (
        <ClassList
            title={`Lớp học của khóa "${course.title}"`}
            subtitle={`Quản lý các lớp học thuộc khóa ${course.title}`}
            isMyClasses={isMyCourses}

            loadClasses={loadClasses}

            /* data */
            classes={classes}
            loading={loading}
            pagination={pagination}

            /* filters */
            search={search}
            isActive={isActive}

            /* pagination */
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}

            /* ui */
            openAddClass={openAddClass}

            /* handlers */
            onSearchChange={handleSearch}
            onIsActiveChange={handleIsActiveChange}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenAddClass={openAdd}
            onCloseAddClass={closeAdd}

            /* add class props */
            defaultCourseId={courseId}
            canSelectCourse={false}
            canSelectInstructor={true}
        />
    );
};
