import React, { useState } from 'react';
import { QuickStat, ChartCard, type LineData } from '@/features/dashboard/components';
import { 
    Users, 
    UserPlus, 
    Lock,
    Activity,
    FileText,
    Bell
} from 'lucide-react';

type TimePeriod = 'week' | 'month' | 'year';

export const AdminDashboard: React.FC = () => {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

    // Get labels based on time period
    const getLabels = (): string[] => {
        if (timePeriod === 'week') {
            return ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        } else if (timePeriod === 'month') {
            return ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
        } else {
            return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        }
    };

    // Admin activity data (new admins + suspended admins)
    const getAdminActivityData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Admin mới',
                    color: '#10b981',
                    data: [1, 0, 2, 1, 0, 1, 0],
                },
                {
                    label: 'Bị khóa',
                    color: '#ef4444',
                    data: [0, 0, 1, 0, 0, 0, 0],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Admin mới',
                    color: '#10b981',
                    data: [3, 2, 4, 3],
                },
                {
                    label: 'Bị khóa',
                    color: '#ef4444',
                    data: [0, 1, 0, 1],
                },
            ];
        } else {
            return [
                {
                    label: 'Admin mới',
                    color: '#10b981',
                    data: [8, 6, 10, 7, 9, 5, 8, 12, 6, 7, 10, 8],
                },
                {
                    label: 'Bị khóa',
                    color: '#ef4444',
                    data: [1, 0, 2, 1, 0, 1, 0, 2, 1, 0, 1, 1],
                },
            ];
        }
    };

    // System logs data
    const getSystemLogsData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Info',
                    color: '#3b82f6',
                    data: [250, 280, 260, 290, 270, 300, 0],
                },
                {
                    label: 'Warning',
                    color: '#f59e0b',
                    data: [45, 50, 48, 52, 47, 55, 0],
                },
                {
                    label: 'Error',
                    color: '#ef4444',
                    data: [12, 8, 15, 10, 13, 9, 0],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Info',
                    color: '#3b82f6',
                    data: [1200, 1300, 1250, 1350],
                },
                {
                    label: 'Warning',
                    color: '#f59e0b',
                    data: [200, 220, 210, 230],
                },
                {
                    label: 'Error',
                    color: '#ef4444',
                    data: [45, 38, 42, 40],
                },
            ];
        } else {
            return [
                {
                    label: 'Info',
                    color: '#3b82f6',
                    data: [4800, 5000, 4900, 5200, 5100, 5300, 5400, 5500, 5600, 5700, 5800, 5900],
                },
                {
                    label: 'Warning',
                    color: '#f59e0b',
                    data: [850, 900, 880, 920, 900, 950, 940, 980, 960, 1000, 990, 1020],
                },
                {
                    label: 'Error',
                    color: '#ef4444',
                    data: [180, 160, 175, 155, 170, 150, 165, 145, 160, 140, 155, 135],
                },
            ];
        }
    };

    // Notifications data
    const getNotificationsData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Đã gửi',
                    color: '#10b981',
                    data: [45, 50, 48, 52, 47, 55, 50],
                },
                {
                    label: 'Đang chờ',
                    color: '#f59e0b',
                    data: [12, 8, 10, 7, 9, 5, 8],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Đã gửi',
                    color: '#10b981',
                    data: [180, 200, 195, 210],
                },
                {
                    label: 'Đang chờ',
                    color: '#f59e0b',
                    data: [35, 30, 32, 28],
                },
            ];
        } else {
            return [
                {
                    label: 'Đã gửi',
                    color: '#10b981',
                    data: [750, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980],
                },
                {
                    label: 'Đang chờ',
                    color: '#f59e0b',
                    data: [120, 110, 105, 100, 95, 90, 85, 80, 75, 70, 65, 60],
                },
            ];
        }
    };

    const labels = getLabels();
    const adminActivityData = getAdminActivityData();
    const systemLogsData = getSystemLogsData();
    const notificationsData = getNotificationsData();

    // Calculate totals for stats
    const totalNewAdmins = adminActivityData[0].data.reduce((sum, val) => sum + val, 0);
    const totalSuspended = adminActivityData[1].data.reduce((sum, val) => sum + val, 0);
    const totalLogs = systemLogsData.reduce((sum, line) => 
        sum + line.data.reduce((s, v) => s + v, 0), 0
    );
    const totalNotificationsSent = notificationsData[0].data.reduce((sum, val) => sum + val, 0);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
                    <p className="text-xs text-gray-600 mt-1">Tổng quan hệ thống và quản trị</p>
                </div>
                
                {/* Time Period Selector */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setTimePeriod('week')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                            timePeriod === 'week'
                                ? 'bg-white text-gray-900 shadow'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Tuần
                    </button>
                    <button
                        onClick={() => setTimePeriod('month')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                            timePeriod === 'month'
                                ? 'bg-white text-gray-900 shadow'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Tháng
                    </button>
                    <button
                        onClick={() => setTimePeriod('year')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                            timePeriod === 'year'
                                ? 'bg-white text-gray-900 shadow'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Năm
                    </button>
                </div>
            </div>

            {/* First Row - Admin Activity Chart + Quick Stats */}
            <div className="flex items-stretch gap-4">
                {/* Charts Row 1 - Admin Activity */}
                <div className='flex-1'>
                    <ChartCard
                        title="Thống kê Admin"
                        subtitle={`Admin mới và bị khóa theo ${timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}`}
                        icon={Users}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                        labels={labels}
                        lines={adminActivityData}
                        height={200}
                    />
                </div>
                {/* Quick Stats */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <QuickStat
                        title="Tổng Admin"
                        value={48}
                        percent="+3.1%"
                        isIncrease={true}
                        icon={Users}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <QuickStat
                        title="Admin mới"
                        value={totalNewAdmins}
                        percent="+8.2%"
                        isIncrease={true}
                        icon={UserPlus}
                        iconBg="bg-green-100"
                        iconColor="text-green-600"
                    />
                    <QuickStat
                        title="Bị khóa"
                        value={totalSuspended}
                        percent="-1.5%"
                        isIncrease={false}
                        icon={Lock}
                        iconBg="bg-red-100"
                        iconColor="text-red-600"
                    />
                    <QuickStat
                        title="Hoạt động"
                        value={45}
                        percent="+2.3%"
                        isIncrease={true}
                        icon={Activity}
                        iconBg="bg-purple-100"
                        iconColor="text-purple-600"
                    />
                </div>
            </div>

            {/* Charts Row 2 - System Logs and Notifications */}
            <div className="grid grid-cols-2 gap-4">
                <ChartCard
                    title="Nhật ký hệ thống"
                    subtitle={`Theo ${timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}`}
                    icon={FileText}
                    iconBg="bg-indigo-100"
                    iconColor="text-indigo-600"
                    labels={labels}
                    lines={systemLogsData}
                    height={200}
                />
                <ChartCard
                    title="Thông báo"
                    subtitle={`Theo ${timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}`}
                    icon={Bell}
                    iconBg="bg-yellow-100"
                    iconColor="text-yellow-600"
                    labels={labels}
                    lines={notificationsData}
                    height={200}
                />
            </div>
        </div>
    );
};
