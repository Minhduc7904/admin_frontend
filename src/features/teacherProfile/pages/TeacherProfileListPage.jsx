import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { useSearch } from '../../../shared/hooks';
import {
    deleteTeacherProfileAsync,
    getAllTeacherProfilesAsync,
    selectTeacherProfileFilters,
    selectTeacherProfileLoadingDelete,
    selectTeacherProfileLoadingGet,
    selectTeacherProfilePagination,
    selectTeacherProfiles,
    setFilters,
    setPagination,
} from '../store/teacherProfileSlice';
import { TeacherProfileList } from './TeacherProfileList';

export const TeacherProfileListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const teacherProfiles = useSelector(selectTeacherProfiles);
    const loading = useSelector(selectTeacherProfileLoadingGet);
    const loadingDelete = useSelector(selectTeacherProfileLoadingDelete);
    const filters = useSelector(selectTeacherProfileFilters);
    const pagination = useSelector(selectTeacherProfilePagination);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const loadTeacherProfiles = useCallback(() => {
        dispatch(
            getAllTeacherProfilesAsync({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch || undefined,
                visibility: filters.visibility || undefined,
                isFeatured: filters.isFeatured === '' ? undefined : filters.isFeatured,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            })
        );
    }, [debouncedSearch, dispatch, filters, pagination.limit, pagination.page]);

    useEffect(() => {
        loadTeacherProfiles();
    }, [loadTeacherProfiles]);

    const resetPageAndSetFilter = (nextFilter) => {
        dispatch(setPagination({ page: 1 }));
        dispatch(setFilters(nextFilter));
    };

    const handleSearch = (value) => {
        handleSearchChange(value);
        resetPageAndSetFilter({ search: value });
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        await dispatch(deleteTeacherProfileAsync(deleteTarget.teacherProfileId)).unwrap();
        setDeleteTarget(null);
        loadTeacherProfiles();
    };

    return (
        <TeacherProfileList
            teacherProfiles={teacherProfiles}
            loading={loading}
            pagination={pagination}
            filters={filters}
            search={search}
            onCreate={() => navigate(ROUTES.TEACHER_PROFILE_CREATE)}
            onView={(profile) => navigate(ROUTES.TEACHER_PROFILE_DETAIL(profile.teacherProfileId))}
            onDelete={setDeleteTarget}
            onSearchChange={handleSearch}
            onVisibilityChange={(visibility) => resetPageAndSetFilter({ visibility })}
            onFeaturedChange={(isFeatured) => resetPageAndSetFilter({ isFeatured })}
            onPageChange={(page) => dispatch(setPagination({ page }))}
            onItemsPerPageChange={(limit) => dispatch(setPagination({ page: 1, limit }))}
            deleteTarget={deleteTarget}
            onCloseDeleteModal={() => setDeleteTarget(null)}
            onConfirmDelete={handleConfirmDelete}
            loadingDelete={loadingDelete}
        />
    );
};
