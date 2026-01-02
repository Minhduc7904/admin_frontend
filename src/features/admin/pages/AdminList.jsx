import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid } from '../../../shared/components/ui';
import {
    getAllAdminsAsync,
    setFilters,
    selectAdmins,
    selectAdminLoadingGet,
    selectAdminPagination,
} from '../store/adminSlice';
import { useSearch } from '../../../shared/hooks';
import { AdminFilters, AdminTable } from '../components';
import { Pagination } from '../../../shared/components/ui/Pagination';
import { ROUTES } from '../../../core/constants';
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

    useEffect(() => {
        loadAdmins();
    }, [currentPage, itemsPerPage, debouncedSearch, debouncedSearch]);

    const loadAdmins = () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
        };

        dispatch(getAllAdminsAsync(params));
    };

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1); // Reset to first page on search
        dispatch(setFilters({ search: value }));
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
                    <Button onClick={() => { }}>
                        <Plus size={16} />
                        Thêm quản trị viên mới
                    </Button>
                </div>

                {/* Filter and Search */}
                <AdminFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                />
            </div>

            {/* Stats Grid */}
            <StatsGrid cols={3} className="mb-4">
                <StatsCard
                    label="Tổng quản trị viên"
                    value={pagination.total}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Đang hiển thị"
                    value={admins.length}
                    variant="primary"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Đang hoạt động"
                    value={admins.filter(admin => admin.isActive).length}
                    variant="success"
                    loading={loadingGet}
                />
            </StatsGrid>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <AdminTable
                    admins={admins}
                    onView={handleView}
                    // onDelete={handleDelete}
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

        </>
    );
}