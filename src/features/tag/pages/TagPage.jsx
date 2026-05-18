import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Tags } from 'lucide-react';
import { Button, Pagination, RightPanel } from '../../../shared/components/ui';
import { useSearch } from '../../../shared/hooks';
import { TagDeleteModal, TagFilters, TagForm, TagTable } from '../components';
import {
    createTagAsync,
    deleteTagAsync,
    getAllTagsAsync,
    selectTagFilters,
    selectTagLoadingCreate,
    selectTagLoadingDelete,
    selectTagLoadingGet,
    selectTagLoadingUpdate,
    selectTagPagination,
    selectTags,
    setFilters,
    updateTagAsync,
} from '../store/tagSlice';

const DEFAULT_FORM_DATA = {
    name: '',
    type: 'OTHER',
    description: '',
    isActive: true,
};

const normalizePayload = (formData) => ({
    name: formData.name.trim(),
    type: formData.type,
    description: formData.description.trim() || undefined,
    isActive: formData.isActive,
});

export const TagPage = () => {
    const dispatch = useDispatch();

    const tags = useSelector(selectTags);
    const pagination = useSelector(selectTagPagination);
    const filters = useSelector(selectTagFilters);
    const loadingGet = useSelector(selectTagLoadingGet);
    const loadingCreate = useSelector(selectTagLoadingCreate);
    const loadingUpdate = useSelector(selectTagLoadingUpdate);
    const loadingDelete = useSelector(selectTagLoadingDelete);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [formErrors, setFormErrors] = useState({});

    const loadTags = useCallback(() => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
            type: filters.type || undefined,
            isActive: filters.isActive === '' ? undefined : filters.isActive,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        };

        dispatch(getAllTagsAsync(params));
    }, [currentPage, debouncedSearch, dispatch, filters.isActive, filters.sortBy, filters.sortOrder, filters.type, itemsPerPage]);

    useEffect(() => {
        loadTags();
    }, [loadTags]);

    const resetForm = () => {
        setFormData(DEFAULT_FORM_DATA);
        setFormErrors({});
    };

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1);
        dispatch(setFilters({ search: value }));
    };

    const handleTypeChange = (value) => {
        setCurrentPage(1);
        dispatch(setFilters({ type: value }));
    };

    const handleStatusChange = (value) => {
        setCurrentPage(1);
        dispatch(setFilters({ isActive: value }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSwitchChange = (checked) => {
        setFormData((prev) => ({ ...prev, isActive: checked }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Tên tag không được để trống';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Tên tag phải có ít nhất 2 ký tự';
        }

        if (!formData.type) {
            errors.type = 'Vui lòng chọn loại tag';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreate = () => {
        resetForm();
        setIsCreatePanelOpen(true);
    };

    const handleCancelCreate = () => {
        setIsCreatePanelOpen(false);
        resetForm();
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(createTagAsync(normalizePayload(formData))).unwrap();
            setIsCreatePanelOpen(false);
            resetForm();
            loadTags();
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    };

    const handleEdit = (tag) => {
        setSelectedTag(tag);
        setFormData({
            name: tag.name || '',
            type: tag.type || 'OTHER',
            description: tag.description || '',
            isActive: tag.isActive ?? true,
        });
        setFormErrors({});
        setIsEditPanelOpen(true);
    };

    const handleCancelEdit = () => {
        setIsEditPanelOpen(false);
        setSelectedTag(null);
        resetForm();
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(updateTagAsync({
                id: selectedTag.tagId,
                data: normalizePayload(formData),
            })).unwrap();
            setIsEditPanelOpen(false);
            setSelectedTag(null);
            resetForm();
            loadTags();
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    };

    const handleDelete = (tag) => {
        setSelectedTag(tag);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteTagAsync(selectedTag.tagId)).unwrap();
            setIsDeleteModalOpen(false);
            setSelectedTag(null);
            loadTags();
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="mb-2">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Tags size={22} className="text-foreground" />
                            <h1 className="text-2xl font-bold text-foreground">
                                Quản lý tag tài liệu
                            </h1>
                        </div>
                        <p className="text-sm text-foreground-light">
                            Quản lý tag dùng để phân loại tài liệu theo khối lớp, môn học, chương, chủ đề và từ khóa.
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus size={16} />
                        Thêm tag mới
                    </Button>
                </div>

                <TagFilters
                    search={search}
                    type={filters.type}
                    isActive={filters.isActive}
                    onSearchChange={handleSearchChangeWrapper}
                    onTypeChange={handleTypeChange}
                    onStatusChange={handleStatusChange}
                />
            </div>

            <div className="rounded-sm border border-border bg-white">
                <TagTable
                    tags={tags}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loadingGet}
                />

                <div className="border-t border-border p-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                    />
                </div>
            </div>

            <TagDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                tag={selectedTag}
                loading={loadingDelete}
            />

            <RightPanel
                isOpen={isCreatePanelOpen}
                onClose={handleCancelCreate}
                title="Tạo tag mới"
            >
                <TagForm
                    formData={formData}
                    errors={formErrors}
                    onChange={handleFormChange}
                    onSwitchChange={handleSwitchChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={handleCancelCreate}
                    loading={loadingCreate}
                    mode="create"
                />
            </RightPanel>

            <RightPanel
                isOpen={isEditPanelOpen}
                onClose={handleCancelEdit}
                title="Cập nhật tag"
            >
                <TagForm
                    formData={formData}
                    errors={formErrors}
                    onChange={handleFormChange}
                    onSwitchChange={handleSwitchChange}
                    onSubmit={handleSubmitEdit}
                    onCancel={handleCancelEdit}
                    loading={loadingUpdate}
                    mode="edit"
                />
            </RightPanel>
        </>
    );
};
