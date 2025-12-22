import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, FileText } from 'lucide-react';
import {
    SystemLogsPageHeader,
    SystemLogsFilters,
    SystemLogsStats,
    SystemLogsItem,
    type LogEntry,
} from '../components/logs';

type LogStatus = 'all' | 'success' | 'error' | 'warning' | 'info';

export const SystemLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 20;

    // Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<LogStatus>('all');

    // Infinite scroll
    const observerTarget = useRef<HTMLDivElement>(null);

    // Mock data generator
    const generateMockLogs = (pageNum: number, itemsPerPage: number): LogEntry[] => {
        const statuses: Array<'success' | 'error' | 'warning' | 'info'> = ['success', 'error', 'warning', 'info'];
        const actions = [
            'Đăng nhập',
            'Đăng xuất',
            'Tạo tài khoản',
            'Cập nhật thông tin',
            'Xóa tài khoản',
            'Thay đổi quyền',
            'Xuất báo cáo',
            'Tải file',
            'Xóa file',
            'Cập nhật cấu hình',
            'Backup dữ liệu',
            'Restore dữ liệu',
        ];
        const modules = ['Admin', 'Giáo dục', 'Học sinh', 'Public', 'Hệ thống'];
        const users = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'];

        const mockLogs: LogEntry[] = [];
        const startIndex = (pageNum - 1) * itemsPerPage;

        for (let i = 0; i < itemsPerPage; i++) {
            const index = startIndex + i;
            const date = new Date();
            date.setMinutes(date.getMinutes() - index * 5);

            mockLogs.push({
                id: `log-${index + 1}`,
                timestamp: date.toISOString(),
                action: actions[index % actions.length],
                user: users[index % users.length],
                userId: `user-${(index % 10) + 1}`,
                description: `${actions[index % actions.length]} từ module ${modules[index % modules.length]}`,
                status: statuses[index % statuses.length],
                ipAddress: `192.168.1.${(index % 255) + 1}`,
                module: modules[index % modules.length],
            });
        }

        return mockLogs;
    };

    // Load more logs
    const loadMoreLogs = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newLogs = generateMockLogs(page, limit);

            // Simulate end of data after 5 pages (100 items)
            if (page >= 5) {
                setHasMore(false);
            }

            setLogs((prev) => [...prev, ...newLogs]);
            setPage((prev) => prev + 1);
            setLoading(false);
        }, 500);
    }, [page, loading, hasMore, limit]);

    // Initial load
    useEffect(() => {
        loadMoreLogs();
    }, []);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    loadMoreLogs();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMoreLogs, loading, hasMore]);

    // Filter logs
    const filteredLogs = logs.filter((log) => {
        // Status filter
        if (statusFilter !== 'all' && log.status !== statusFilter) return false;

        // Search filter
        if (
            searchQuery &&
            !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !log.user.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !log.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return false;
        }

        // Date filter
        if (startDate || endDate) {
            const logDate = new Date(log.timestamp);
            if (startDate && logDate < new Date(startDate)) return false;
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (logDate > end) return false;
            }
        }

        return true;
    });

    // Reset filters
    const handleResetFilters = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setStatusFilter('all');
        setLogs([]);
        setPage(1);
        setHasMore(true);
        setTimeout(() => loadMoreLogs(), 100);
    };

    // Apply filters
    const handleApplyFilters = () => {
        setLogs([]);
        setPage(1);
        setHasMore(true);
        setTimeout(() => loadMoreLogs(), 100);
    };

    // Export logs
    const handleExport = () => {
        console.log('Export logs');
    };

    // Calculate stats
    const successCount = logs.filter((l) => l.status === 'success').length;
    const errorCount = logs.filter((l) => l.status === 'error').length;
    const warningCount = logs.filter((l) => l.status === 'warning').length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <SystemLogsPageHeader onExport={handleExport} />

            {/* Stats */}
            <SystemLogsStats
                totalLogs={logs.length}
                successCount={successCount}
                errorCount={errorCount}
                warningCount={warningCount}
            />

            {/* Filters */}
            <SystemLogsFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />

            {/* Logs List */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-2">
                    {filteredLogs.length > 0 ? (
                        <>
                            {filteredLogs.map((log) => (
                                <SystemLogsItem key={log.id} log={log} />
                            ))}

                            {/* Loading indicator */}
                            {loading && (
                                <div className="flex items-center justify-center py-6">
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <RefreshCw size={16} className="animate-spin" />
                                        <span>Đang tải thêm...</span>
                                    </div>
                                </div>
                            )}

                            {/* Observer target for infinite scroll */}
                            {hasMore && !loading && <div ref={observerTarget} className="h-4" />}

                            {/* End of list message */}
                            {!hasMore && (
                                <div className="text-center py-6">
                                    <p className="text-xs text-gray-500">Đã hiển thị tất cả nhật ký</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <FileText size={40} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-xs text-gray-500">Không tìm thấy nhật ký phù hợp</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
