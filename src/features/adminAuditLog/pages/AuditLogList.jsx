import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, LoaderCircle } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components/ui';
import { AuditLogTable, AuditLogFilters, AuditLogDetail } from '../components';
import { useSearch, useInfiniteScroll } from '../../../shared/hooks';
import {
    getAllAuditLogsAsync,
    rollbackAuditLogAsync,
    selectAuditLogs,
    selectAuditLogPagination,
    selectAuditLogLoadingGet,
    selectAuditLogLoadingRollback,
    setFilters,
    selectAuditLogFilters,
} from '../store/auditLogSlice';
import {
    selectCurrentAdmin,
    selectAdminLoadingGet
} from '../../admin/store/adminSlice';
import { useParams } from 'react-router-dom';

export const AuditLogList = () => {
    const dispatch = useDispatch();

    const { id } = useParams();
    const admin = useSelector(selectCurrentAdmin);
    const loadingAdminGet = useSelector(selectAdminLoadingGet);
    const invalidId = isNaN(id) || id <= 0;
    const [adminId, setAdminId] = useState(null);
    const [loadingAdminDone, setLoadingAdminDone] = useState(false);
    
    useEffect(() => {
        if (id && !invalidId && admin?.adminId) {
            setAdminId(Number(admin.adminId));
            setLoadingAdminDone(true);
        } else if (invalidId || !id) {
            setAdminId(null);
            setLoadingAdminDone(true);
        } else {
            setAdminId(null);
        }
    }, [id, invalidId, admin?.adminId]);

    const auditLogs = useSelector(selectAuditLogs);
    const pagination = useSelector(selectAuditLogPagination);
    const filters = useSelector(selectAuditLogFilters);
    const loadingGet = useSelector(selectAuditLogLoadingGet);
    const loadingRollback = useSelector(selectAuditLogLoadingRollback);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [status, setStatus] = useState(filters.status);
    const [resourceType, setResourceType] = useState(filters.resourceType);
    const [fromDate, setFromDate] = useState(filters.fromDate);
    const [toDate, setToDate] = useState(filters.toDate);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [allLogs, setAllLogs] = useState([]);

    // Load initial data
    useEffect(() => {
        if (!loadingAdminDone) return;
        loadLogs(1, true);
    }, [debouncedSearch, status, resourceType, fromDate, toDate, adminId, loadingAdminDone]);

    // Update allLogs when new data comes in
    useEffect(() => {
        if (currentPage === 1) {
            setAllLogs(auditLogs);
        } else {
            setAllLogs(prev => [...prev, ...auditLogs]);
        }
    }, [auditLogs, currentPage]);

    const loadLogs = useCallback((page = 1, reset = false) => {
        if (!loadingAdminDone) return;
        if (reset) {
            setAllLogs([]);
            setCurrentPage(1);
        }

        const params = {
            page,
            limit: 20,
            search: debouncedSearch || undefined,
            status: status || undefined,
            resourceType: resourceType || undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            adminId: adminId || undefined,
        };

        dispatch(getAllAuditLogsAsync(params));
    }, [debouncedSearch, status, resourceType, fromDate, toDate, filters.sortBy, filters.sortOrder, adminId, loadingAdminDone]);

    const loadMore = useCallback(() => {
        if (!loadingAdminDone) return;
        if (pagination.hasNext && !loadingGet) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadLogs(nextPage, false);
        }
    }, [pagination.hasNext, loadingGet, currentPage, loadLogs, adminId, loadingAdminDone]);

    // Infinite scroll
    const lastElementRef = useInfiniteScroll(loadMore, pagination.hasNext, loadingGet);

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        dispatch(setFilters({ search: value }));
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        dispatch(setFilters({ status: value }));
    };

    const handleResourceTypeChange = (value) => {
        setResourceType(value);
        dispatch(setFilters({ resourceType: value }));
    };

    const handleFromDateChange = (value) => {
        setFromDate(value);
        dispatch(setFilters({ fromDate: value }));
    };

    const handleToDateChange = (value) => {
        setToDate(value);
        dispatch(setFilters({ toDate: value }));
    };

    const handleViewDetail = (log) => {
        setSelectedLog(log);
        setIsDetailPanelOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailPanelOpen(false);
        setSelectedLog(null);
    };

    const handleRollback = async (logId) => {
        try {
            await dispatch(rollbackAuditLogAsync(logId)).unwrap();
            handleCloseDetail();
            // Reload data
            loadLogs(1, true);
        } catch (error) {
            console.error('Error rollback:', error);
        }
    };

    const handleRefresh = () => {
        loadLogs(1, true);
    };

    const successCount = allLogs.filter(log => log.status === 'SUCCESS').length;
    const failCount = allLogs.filter(log => log.status === 'FAIL').length;
    const rollbackCount = allLogs.filter(log => log.status === 'ROLLBACK').length;

    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý Audit Log</h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Theo dõi và quản lý các hoạt động trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleRefresh} disabled={loadingGet}>
                        <RefreshCw size={16} className={loadingGet ? 'animate-spin' : ''} />
                        Làm mới
                    </Button>
                </div>

                {/* Filters */}
                <AuditLogFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    status={status}
                    onStatusChange={handleStatusChange}
                    resourceType={resourceType}
                    onResourceTypeChange={handleResourceTypeChange}
                    fromDate={fromDate}
                    onFromDateChange={handleFromDateChange}
                    toDate={toDate}
                    onToDateChange={handleToDateChange}
                />
            </div>

            {/* Stats */}
            <StatsGrid cols={4} className="mb-4">
                <StatsCard
                    label="Tổng logs"
                    value={pagination.total}
                    loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                />
                <StatsCard
                    label="Thành công"
                    value={successCount}
                    variant="success"
                    loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                />
                <StatsCard
                    label="Thất bại"
                    value={failCount}
                    variant="error"
                    loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                />
                <StatsCard
                    label="Đã rollback"
                    value={rollbackCount}
                    variant="warning"
                    loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                />
            </StatsGrid>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <AuditLogTable
                    logs={allLogs}
                    onViewDetail={handleViewDetail}
                    loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                    lastElementRef={lastElementRef}
                />

                {/* Loading more indicator */}
                {(loadingGet && currentPage > 1) || !loadingAdminDone && (
                    <div className="flex items-center justify-center py-4 border-t border-border">
                        <LoaderCircle className="animate-spin text-info mr-2" size={20} />
                        <span className="text-sm text-foreground-light">Đang tải thêm...</span>
                    </div>
                )}

                {/* End of list */}
                {!pagination.hasNext && allLogs.length > 0 && (
                    <div className="text-center py-4 border-t border-border">
                        <span className="text-sm text-foreground-light">
                            Đã hiển thị tất cả {pagination.total} logs
                        </span>
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            <RightPanel
                isOpen={isDetailPanelOpen}
                onClose={handleCloseDetail}
                title=""
                width="lg"
            >
                <AuditLogDetail
                    log={selectedLog}
                    onClose={handleCloseDetail}
                    onRollback={handleRollback}
                    loadingRollback={loadingRollback}
                />
            </RightPanel>
        </>
    );
};
