import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components';
import {
    getAllAdminsAsync,
    setFilters,
    selectAdmins,
    selectAdminLoadingGet,
    selectAdminPagination,
} from '../store/adminSlice';
import { useSearch } from '../../../shared/hooks';
import { AdminFilters, AdminTable, AddAdmin } from '../components';
import { Pagination } from '../../../shared/components/ui/Pagination';
import { ROUTES } from '../../../core/constants';
import {
    toggleUserActivationAsync
} from '../../user/store/userSlice';


export const AdminList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admins = useSelector(selectAdmins);
    const loadingGet = useSelector(selectAdminLoadingGet);
    const pagination = useSelector(selectAdminPagination);
    const filters = useSelector((state) => state.admin.filters);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedIsActive, setSelectedIsActive] = useState('');

    const [openAddAdminRightPanel, setOpenAddAdminRightPanel] = useState(false);

    useEffect(() => {
        loadAdmins();
    }, [currentPage, itemsPerPage, debouncedSearch, selectedIsActive]);

    const loadAdmins = () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
        };

        if (selectedIsActive === 'true') {
            params.isActive = true;
        } else if (selectedIsActive === 'false') {
            params.isActive = false;
        }

        dispatch(getAllAdminsAsync(params));
    };

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1); // Reset to first page on search
        dispatch(setFilters({ search: value }));
    };

    const handleIsActiveChange = (value) => {
        setSelectedIsActive(value);
        setCurrentPage(1); // Reset to first page on filter change
        dispatch(setFilters({ isActive: value }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleView = (admin) => {
        navigate(ROUTES.ADMIN_DETAIL(admin.adminId));
    };

    const handleOpenAddAdmin = () => {
        setOpenAddAdminRightPanel(true);
    }

    const handleCloseAddAdmin = () => {
        setOpenAddAdminRightPanel(false);
    }

    const handleToggleActivation = async (admin) => {
        await dispatch(toggleUserActivationAsync(admin.userId)).unwrap();
        loadAdmins();
    }

    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý Admin</h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý danh sách quản trị viên trong hệ thống.
                        </p>
                    </div>
                    <Button onClick={handleOpenAddAdmin}>
                        <Plus size={16} />
                        Thêm quản trị viên mới
                    </Button>
                </div>

                {/* Filter and Search */}
                <AdminFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    isActive={selectedIsActive}
                    onIsActiveChange={handleIsActiveChange}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <AdminTable
                    admins={admins}
                    onView={handleView}
                    // onDelete={handleDelete}
                    loading={loadingGet}
                    onToggleActivation={handleToggleActivation}
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

            <RightPanel
                isOpen={openAddAdminRightPanel}
                onClose={handleCloseAddAdmin}
                title="Thêm quản trị viên mới"
            >
                <AddAdmin onClose={handleCloseAddAdmin} />
            </RightPanel>

        </>
    );
}