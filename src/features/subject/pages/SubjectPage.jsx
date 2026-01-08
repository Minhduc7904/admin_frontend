import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid, Pagination, RightPanel } from '../../../shared/components/ui';
import { SubjectTable, SubjectFilters, SubjectDeleteModal, SubjectForm } from '../components';
import { useSearch } from '../../../shared/hooks';
import {
    getAllSubjectsAsync,
    createSubjectAsync,
    updateSubjectAsync,
    deleteSubjectAsync,
    selectSubjects,
    selectSubjectPagination,
    selectSubjectLoadingGet,
    selectSubjectLoadingCreate,
    selectSubjectLoadingUpdate,
    selectSubjectLoadingDelete,
    setFilters,
    selectSubjectFilters,
} from '../store/subjectSlice';

export const SubjectPage = () => {
    const dispatch = useDispatch();

    const subjects = useSelector(selectSubjects);
    const pagination = useSelector(selectSubjectPagination);
    const filters = useSelector(selectSubjectFilters);
    const loadingGet = useSelector(selectSubjectLoadingGet);
    const loadingCreate = useSelector(selectSubjectLoadingCreate);
    const loadingUpdate = useSelector(selectSubjectLoadingUpdate);
    const loadingDelete = useSelector(selectSubjectLoadingDelete);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // Load subjects when filters or page change
    useEffect(() => {
        loadSubjects();
    }, [currentPage, debouncedSearch, itemsPerPage]);

    const loadSubjects = () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        };

        dispatch(getAllSubjectsAsync(params));
    };

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1); // Reset to first page on search
        dispatch(setFilters({ search: value }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Tên môn học không được để trống';
        } else if (formData.name.length < 2) {
            errors.name = 'Tên môn học phải có ít nhất 2 ký tự';
        }

        if (!formData.code.trim()) {
            errors.code = 'Mã môn học không được để trống';
        } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
            errors.code = 'Mã môn học chỉ được chứa chữ hoa, số và gạch dưới';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(createSubjectAsync(formData)).unwrap();
            setIsCreatePanelOpen(false);
            loadSubjects();
        } catch (error) {
            console.error('Error creating subject:', error);
        }
    };

    const handleCancelCreate = () => {
        setIsCreatePanelOpen(false);
        setFormData({
            name: '',
            code: '',
        });
        setFormErrors({});
    };

    const handleCreate = () => {
        setFormData({
            name: '',
            code: '',
        });
        setFormErrors({});
        setIsCreatePanelOpen(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleEdit = (subject) => {
        setSelectedSubject(subject);
        setFormData({
            name: subject.name,
            code: subject.code || '',
        });
        setFormErrors({});
        setIsEditPanelOpen(true);
    };

    const handleDelete = (subject) => {
        setSelectedSubject(subject);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteSubjectAsync(selectedSubject.subjectId)).unwrap();
            setIsDeleteModalOpen(false);
            loadSubjects();
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(updateSubjectAsync({
                id: selectedSubject.subjectId,
                data: formData
            })).unwrap();
            setIsEditPanelOpen(false);
            loadSubjects();
        } catch (error) {
            console.error('Error updating subject:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditPanelOpen(false);
        setSelectedSubject(null);
        setFormData({
            name: '',
            code: '',
        });
        setFormErrors({});
    };

    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý môn học</h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý các môn học trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus size={16} />
                        Thêm môn học mới
                    </Button>
                </div>

                {/* Filters */}
                <SubjectFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                />
            </div>

            {/* Stats */}
            <StatsGrid cols={3} className="mb-4">
                <StatsCard
                    label="Tổng môn học"
                    value={pagination.total}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Trang hiện tại"
                    value={`${currentPage}/${pagination.totalPages || 1}`}
                    variant="info"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Hiển thị"
                    value={`${subjects.length}/${pagination.total}`}
                    variant="success"
                    loading={loadingGet}
                />
            </StatsGrid>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <SubjectTable
                    subjects={subjects}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loadingGet}
                />

                {/* Pagination */}
                <div className="p-4 border-t border-border">
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

            {/* Delete Modal */}
            <SubjectDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                subject={selectedSubject}
                loading={loadingDelete}
            />

            {/* Create Panel */}
            <RightPanel
                isOpen={isCreatePanelOpen}
                onClose={handleCancelCreate}
                title="Tạo môn học mới"
            >
                <SubjectForm
                    formData={formData}
                    errors={formErrors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={handleCancelCreate}
                    loading={loadingCreate}
                    mode="create"
                />
            </RightPanel>

            {/* Edit Panel */}
            <RightPanel
                isOpen={isEditPanelOpen}
                onClose={handleCancelEdit}
                title="Chỉnh sửa môn học"
            >
                <SubjectForm
                    formData={formData}
                    errors={formErrors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitEdit}
                    onCancel={handleCancelEdit}
                    loading={loadingUpdate}
                    mode="edit"
                />
            </RightPanel>
        </>
    );
};
