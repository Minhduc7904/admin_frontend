import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    getMyCourseClassesAsync,
    deleteCourseClassAsync,
    setMyFilters,
    setMyPagination,
    selectMyCourseClasses,
    selectMyCourseClassLoadingGet,
    selectMyCourseClassPagination,
    selectMyCourseClassFilters,
} from '../store/courseClassSlice';
import { selectProfile } from '../../profile/store/profileSlice';

import { ClassList } from './ClassList';
import { useSearch } from '../../../shared/hooks';
import { ROUTES } from '../../../core/constants';

/**
 * MyClassList
 * Container component – xử lý logic, data, routing cho My Classes
 */
export const MyClassList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector(selectProfile);
    const teacherId = profile?.adminId || null;

    /* ===================== REDUX STATE ===================== */
    const classes = useSelector(selectMyCourseClasses);
    const loading = useSelector(selectMyCourseClassLoadingGet);
    const pagination = useSelector(selectMyCourseClassPagination);
    const filters = useSelector(selectMyCourseClassFilters);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(
        filters.search,
        500,
    );

    const [isActive, setIsActive] = useState('');
    const [openAddClass, setOpenAddClass] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Lấy từ slice thay vì state local
    const currentPage = pagination.page;
    const itemsPerPage = pagination.limit;

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        loadClasses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        isActive,
        teacherId,
    ]);

    /* ===================== DATA ===================== */
    const loadClasses = () => {
        dispatch(
            getMyCourseClassesAsync({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
                teacherId: teacherId || undefined,
            }),
        );
    };

    /* ===================== HANDLERS ===================== */
    const handleSearch = (value) => {
        handleSearchChange(value);
        dispatch(setMyPagination({ page: 1 }));
        dispatch(setMyFilters({ search: value }));
    };

    const handleIsActiveChange = (value) => {
        setIsActive(value);
        dispatch(setMyPagination({ page: 1 }));
    };

    const handlePageChange = (page) => {
        dispatch(setMyPagination({ page }));
    };

    const handleItemsPerPageChange = (value) => {
        dispatch(setMyPagination({ limit: value, page: 1 }));
    };

    const handleView = (classItem) => {
        if (!classItem) return;
        const queryString = '?from=my-classes';
        navigate(ROUTES.CLASS_DETAIL(classItem.classId) + queryString);
    };

    const handleEdit = (classItem) => {
        // navigate(ROUTES.CLASS_EDIT(classItem.classId));
    };

    const handleDelete = (classItem) => {
        setDeleteTarget(classItem);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await dispatch(deleteCourseClassAsync(deleteTarget.classId)).unwrap();
            loadClasses();
        } catch (error) {
            console.error('Delete class failed:', error);
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleCloseDeleteModal = () => setDeleteTarget(null);

    /* ===================== ADD CLASS ===================== */
    const openAdd = () => setOpenAddClass(true);
    const closeAdd = () => setOpenAddClass(false);

    /* ===================== RENDER ===================== */
    return (
        <ClassList
            title="Lớp học của tôi"
            subtitle="Quản lý các lớp học thuộc khóa học mà bạn phụ trách."
            isMyClasses={true}

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
            defaultInstructorId={teacherId}
            canSelectInstructor={false}
            filterCourseTeacherId={teacherId}
            defaultCourseId={null}
            canSelectCourse={true}
            deleteTarget={deleteTarget}
            openDeleteModal={!!deleteTarget}
            onCloseDeleteModal={handleCloseDeleteModal}
            onConfirmDelete={handleConfirmDelete}
        />
    );
};
