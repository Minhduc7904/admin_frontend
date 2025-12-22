import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import {
    CheatLogFilters,
    CheatLogStats,
    CheatLogItem,
    type CheatLogEntry,
} from './index';

type SeverityType = 'all' | 'critical' | 'warning' | 'info';

export const ExamSessionCheatLogTab: React.FC = () => {
    const [logs, setLogs] = useState<CheatLogEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 20;

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [severityFilter, setSeverityFilter] = useState<SeverityType>('all');

    // Infinite scroll
    const observerTarget = useRef<HTMLDivElement>(null);

    // Mock data generator
    const generateMockLogs = (pageNum: number, itemsPerPage: number): CheatLogEntry[] => {
        const severities: Array<'critical' | 'warning' | 'info'> = ['critical', 'warning', 'info'];
        const actions = [
            'Chuyển tab trình duyệt',
            'Copy nội dung',
            'Rời khỏi cửa sổ thi',
            'Mở tab mới',
            'Sử dụng Dev Tools',
            'Chụp màn hình',
            'Paste nội dung',
            'Thay đổi kích thước cửa sổ',
            'Phát hiện nhiều thiết bị',
            'IP thay đổi',
            'Thời gian làm bài bất thường',
            'Tốc độ trả lời bất thường',
        ];
        const students = [
            { name: 'Nguyễn Văn A', code: 'HS001', class: '12A1' },
            { name: 'Trần Thị B', code: 'HS002', class: '12A1' },
            { name: 'Lê Văn C', code: 'HS003', class: '12A1' },
            { name: 'Phạm Thị D', code: 'HS004', class: '12A1' },
            { name: 'Hoàng Văn E', code: 'HS005', class: '12A1' },
        ];

        const descriptions = [
            'Học sinh đã chuyển sang tab khác trong trình duyệt',
            'Phát hiện hành động copy nội dung từ bài thi',
            'Học sinh rời khỏi cửa sổ làm bài',
            'Phát hiện mở tab mới trong quá trình làm bài',
            'Phát hiện sử dụng công cụ Developer Tools',
            'Phát hiện hành động chụp màn hình',
            'Phát hiện paste nội dung vào bài làm',
            'Cửa sổ làm bài bị thay đổi kích thước',
            'Phát hiện đăng nhập từ nhiều thiết bị cùng lúc',
            'Địa chỉ IP thay đổi trong quá trình làm bài',
            'Thời gian làm bài nhanh bất thường',
            'Tốc độ trả lời các câu hỏi quá nhanh',
        ];

        const mockLogs: CheatLogEntry[] = [];
        const startIndex = (pageNum - 1) * itemsPerPage;

        for (let i = 0; i < itemsPerPage; i++) {
            const index = startIndex + i;
            const date = new Date();
            date.setMinutes(date.getMinutes() - index * 3);

            const student = students[index % students.length];
            const action = actions[index % actions.length];
            const severity = severities[index % severities.length];

            mockLogs.push({
                id: `cheat-log-${index + 1}`,
                timestamp: date.toISOString(),
                studentName: student.name,
                studentCode: student.code,
                studentClass: student.class,
                action: action,
                description: descriptions[index % descriptions.length],
                severity: severity,
                ipAddress: `192.168.1.${(index % 255) + 1}`,
                deviceInfo: index % 3 === 0 ? 'Chrome 120 / Windows 11' : index % 3 === 1 ? 'Safari 17 / macOS' : 'Firefox 121 / Windows 10',
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

            // Simulate end of data after 3 pages (60 items)
            if (page >= 3) {
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
        // Severity filter
        if (severityFilter !== 'all' && log.severity !== severityFilter) return false;

        // Search filter
        if (
            searchQuery &&
            !log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !log.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setSeverityFilter('all');
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

    // Calculate stats
    const criticalCount = logs.filter((l) => l.severity === 'critical').length;
    const warningCount = logs.filter((l) => l.severity === 'warning').length;
    const infoCount = logs.filter((l) => l.severity === 'info').length;

    return (
        <div className="space-y-4">
            {/* Stats */}
            <CheatLogStats
                totalLogs={logs.length}
                criticalCount={criticalCount}
                warningCount={warningCount}
                infoCount={infoCount}
            />

            {/* Filters */}
            <CheatLogFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                severityFilter={severityFilter}
                onSeverityFilterChange={setSeverityFilter}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />

            {/* Logs List */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-2">
                    {filteredLogs.length > 0 ? (
                        <>
                            {filteredLogs.map((log) => (
                                <CheatLogItem key={log.id} log={log} />
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
                                    <p className="text-xs text-gray-500">Đã hiển thị tất cả log</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <Shield size={40} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-xs text-gray-500">Không tìm thấy log gian lận</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
