import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid, Pagination, RightPanel } from '../../../shared/components/ui';
import { PermissionTable, PermissionFilters, PermissionDeleteModal, PermissionForm } from '../components';
import { useSearch } from '../../../shared/hooks';
import {
    getAllPermissionsAsync,
    getPermissionGroupsAsync,
    createPermissionAsync,
    updatePermissionAsync,
    deletePermissionAsync,
    selectPermissions,
    selectPermissionGroups,
    selectPermissionPagination,
    selectPermissionLoadingGet,
    selectPermissionLoadingCreate,
    selectPermissionLoadingUpdate,
    selectPermissionLoadingDelete,
    selectPermissionLoadingGroups,
    setFilters,
    selectPermissionFilters,
} from '../store/permissionSlice';

export const PermissionList = () => {
    const dispatch = useDispatch();

    const permissions = useSelector(selectPermissions);
    const groups = useSelector(selectPermissionGroups);
    const pagination = useSelector(selectPermissionPagination);
    const filters = useSelector(selectPermissionFilters);
    const loadingGet = useSelector(selectPermissionLoadingGet);
    const loadingCreate = useSelector(selectPermissionLoadingCreate);
    const loadingUpdate = useSelector(selectPermissionLoadingUpdate);
    const loadingDelete = useSelector(selectPermissionLoadingDelete);
    const loadingGroups = useSelector(selectPermissionLoadingGroups);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [group, setGroup] = useState(filters.group);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        group: '',
        isSystem: false,
    });
    const [formErrors, setFormErrors] = useState({});

    // Load groups on mount
    useEffect(() => {
        if (groups.length === 0) dispatch(getPermissionGroupsAsync());
    }, [groups.length]);

    // Load permissions when filters or page change
    useEffect(() => {
        loadPermissions();
    }, [currentPage, debouncedSearch, group, itemsPerPage]);

    const loadPermissions = () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
            group: group || undefined,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        };

        dispatch(getAllPermissionsAsync(params));
    };

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1); // Reset to first page on search
        dispatch(setFilters({ search: value }));
    };

    const handleGroupChange = (value) => {
        setGroup(value);
        setCurrentPage(1); // Reset to first page on filter
        dispatch(setFilters({ group: value }));
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

        if (!formData.code.trim()) {
            errors.code = 'Mã quyền không được để trống';
        }

        if (!formData.name.trim()) {
            errors.name = 'Tên quyền không được để trống';
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
            await dispatch(createPermissionAsync(formData)).unwrap();
            setIsCreatePanelOpen(false);
            loadPermissions();
            // Reload groups to include new group if added
            dispatch(getPermissionGroupsAsync());
        } catch (error) {
            console.error('Error creating permission:', error);
        }
    };

    const handleCancelCreate = () => {
        setIsCreatePanelOpen(false);
        setFormData({
            code: '',
            name: '',
            description: '',
            group: '',
            isSystem: false,
        });
        setFormErrors({});
    };

    const handleCreate = () => {
        setFormData({
            code: '',
            name: '',
            description: '',
            group: '',
            isSystem: false,
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

    const handleEdit = (permission) => {
        setSelectedPermission(permission);
        setFormData({
            code: permission.code,
            name: permission.name,
            description: permission.description || '',
            group: permission.group || '',
            isSystem: permission.isSystem || false,
        });
        setFormErrors({});
        setIsEditPanelOpen(true);
    };

    const handleDelete = (permission) => {
        setSelectedPermission(permission);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deletePermissionAsync(selectedPermission.permissionId)).unwrap();
            setIsDeleteModalOpen(false);
            loadPermissions();
        } catch (error) {
            console.error('Error deleting permission:', error);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(updatePermissionAsync({
                id: selectedPermission.permissionId,
                data: formData
            })).unwrap();
            setIsEditPanelOpen(false);
            loadPermissions();
            // Reload groups to include new group if added
            dispatch(getPermissionGroupsAsync());
        } catch (error) {
            console.error('Error updating permission:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditPanelOpen(false);
        setSelectedPermission(null);
        setFormData({
            code: '',
            name: '',
            description: '',
            group: '',
            isSystem: false,
        });
        setFormErrors({});
    };

    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý quyền</h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý các quyền trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus size={16} />
                        Thêm quyền mới
                    </Button>
                </div>

                {/* Filters */}
                <PermissionFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    group={group}
                    onGroupChange={handleGroupChange}
                    groups={groups}
                    loadingGroups={loadingGroups}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <PermissionTable
                    permissions={permissions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loadingGet}
                />

                {/* Pagination */}
                {/* {pagination.totalPages > 1 && ( */}
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
                {/* )} */}
            </div>

            {/* Delete Modal */}
            <PermissionDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                permission={selectedPermission}
                loading={loadingDelete}
            />

            {/* Create Panel */}
            <RightPanel
                isOpen={isCreatePanelOpen}
                onClose={handleCancelCreate}
                title="Tạo quyền mới"
            >
                <PermissionForm
                    formData={formData}
                    errors={formErrors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={handleCancelCreate}
                    loading={loadingCreate}
                    groups={groups}
                    mode="create"
                />
            </RightPanel>

            {/* Edit Panel */}
            <RightPanel
                isOpen={isEditPanelOpen}
                onClose={handleCancelEdit}
                title="Chỉnh sửa quyền"
            >
                <PermissionForm
                    formData={formData}
                    errors={formErrors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitEdit}
                    onCancel={handleCancelEdit}
                    loading={loadingUpdate}
                    groups={groups}
                    mode="edit"
                />
            </RightPanel>
        </>
    );
};
