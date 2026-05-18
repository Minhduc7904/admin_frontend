import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { useSearch } from '../../../shared/hooks';
import {
    deleteDocumentAsync,
    getAllDocumentsAsync,
    selectDocumentFilters,
    selectDocumentLoadingDelete,
    selectDocumentLoadingGet,
    selectDocumentPagination,
    selectDocuments,
    setFilters,
    setPagination,
} from '../store/documentSlice';
import { DocumentList } from './DocumentList';

export const DocumentListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const documents = useSelector(selectDocuments);
    const loading = useSelector(selectDocumentLoadingGet);
    const loadingDelete = useSelector(selectDocumentLoadingDelete);
    const filters = useSelector(selectDocumentFilters);
    const pagination = useSelector(selectDocumentPagination);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const loadDocuments = useCallback(() => {
        dispatch(
            getAllDocumentsAsync({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch || undefined,
                visibility: filters.visibility || undefined,
                isFeatured: filters.isFeatured === '' ? undefined : filters.isFeatured,
                tagId: filters.tagId || undefined,
                includeTags: true,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            })
        );
    }, [debouncedSearch, dispatch, filters, pagination.limit, pagination.page]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

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
        await dispatch(deleteDocumentAsync(deleteTarget.documentId)).unwrap();
        setDeleteTarget(null);
        loadDocuments();
    };

    return (
        <DocumentList
            documents={documents}
            loading={loading}
            pagination={pagination}
            filters={filters}
            search={search}
            onCreate={() => navigate(ROUTES.DOCUMENT_CREATE)}
            onView={(document) => navigate(ROUTES.DOCUMENT_DETAIL(document.documentId))}
            onDelete={setDeleteTarget}
            onSearchChange={handleSearch}
            onVisibilityChange={(visibility) => resetPageAndSetFilter({ visibility })}
            onFeaturedChange={(isFeatured) => resetPageAndSetFilter({ isFeatured })}
            onTagIdChange={(tagId) => resetPageAndSetFilter({ tagId })}
            onPageChange={(page) => dispatch(setPagination({ page }))}
            onItemsPerPageChange={(limit) => dispatch(setPagination({ page: 1, limit }))}
            deleteTarget={deleteTarget}
            onCloseDeleteModal={() => setDeleteTarget(null)}
            onConfirmDelete={handleConfirmDelete}
            loadingDelete={loadingDelete}
        />
    );
};
