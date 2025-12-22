import React, { useState } from 'react';
import { QuickStat, ChartCard, type LineData } from '@/features/dashboard/components';
import { 
    Users, 
    UserPlus, 
    UserMinus, 
    CheckCircle,
    DollarSign,
    Calendar
} from 'lucide-react';

type TimePeriod = 'week' | 'month' | 'year';

export const StudentDashboard: React.FC = () => {
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

    // Student enrollment data (new students + dropout students)
    const getEnrollmentData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Học sinh mới',
                    color: '#10b981',
                    data: [3, 5, 2, 4, 6, 1, 0],
                },
                {
                    label: 'Nghỉ học',
                    color: '#ef4444',
                    data: [0, 1, 0, 2, 1, 0, 0],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Học sinh mới',
                    color: '#10b981',
                    data: [12, 15, 20, 18],
                },
                {
                    label: 'Nghỉ học',
                    color: '#ef4444',
                    data: [3, 5, 2, 4],
                },
            ];
        } else {
            return [
                {
                    label: 'Học sinh mới',
                    color: '#10b981',
                    data: [45, 38, 52, 48, 55, 42, 50, 60, 58, 47, 40, 35],
                },
                {
                    label: 'Nghỉ học',
                    color: '#ef4444',
                    data: [8, 6, 10, 7, 9, 5, 8, 12, 6, 7, 5, 4],
                },
            ];
        }
    };

    // Attendance data (present, late, absent)
    const getAttendanceData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Đi đủ',
                    color: '#10b981',
                    data: [420, 425, 418, 430, 422, 415, 0],
                },
                {
                    label: 'Đi muộn',
                    color: '#f59e0b',
                    data: [45, 40, 48, 38, 42, 50, 0],
                },
                {
                    label: 'Vắng',
                    color: '#ef4444',
                    data: [20, 20, 19, 17, 21, 20, 0],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Đi đủ',
                    color: '#10b981',
                    data: [410, 420, 425, 430],
                },
                {
                    label: 'Đi muộn',
                    color: '#f59e0b',
                    data: [50, 45, 42, 40],
                },
                {
                    label: 'Vắng',
                    color: '#ef4444',
                    data: [25, 20, 18, 15],
                },
            ];
        } else {
            return [
                {
                    label: 'Đi đủ',
                    color: '#10b981',
                    data: [380, 390, 400, 410, 415, 420, 425, 430, 435, 440, 438, 442],
                },
                {
                    label: 'Đi muộn',
                    color: '#f59e0b',
                    data: [60, 58, 55, 52, 50, 48, 45, 42, 40, 38, 40, 38],
                },
                {
                    label: 'Vắng',
                    color: '#ef4444',
                    data: [45, 37, 30, 23, 20, 17, 15, 13, 10, 7, 7, 5],
                },
            ];
        }
    };

    // Tuition data (paid, unpaid)
    const getTuitionData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Đã đóng đủ',
                    color: '#10b981',
                    data: [400, 410, 418, 425, 430, 432, 432],
                },
                {
                    label: 'Chưa đóng',
                    color: '#ef4444',
                    data: [85, 75, 67, 60, 55, 53, 53],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Đã đóng đủ',
                    color: '#10b981',
                    data: [350, 380, 410, 432],
                },
                {
                    label: 'Chưa đóng',
                    color: '#ef4444',
                    data: [135, 105, 75, 53],
                },
            ];
        } else {
            return [
                {
                    label: 'Đã đóng đủ',
                    color: '#10b981',
                    data: [420, 425, 430, 435, 440, 442, 445, 448, 450, 452, 455, 460],
                },
                {
                    label: 'Chưa đóng',
                    color: '#ef4444',
                    data: [65, 60, 55, 50, 45, 43, 40, 37, 35, 33, 30, 25],
                },
            ];
        }
    };

    const labels = getLabels();
    const enrollmentData = getEnrollmentData();
    const attendanceData = getAttendanceData();
    const tuitionData = getTuitionData();

    // Calculate totals for stats
    const totalNewStudents = enrollmentData[0].data.reduce((sum, val) => sum + val, 0);
    const totalDropouts = enrollmentData[1].data.reduce((sum, val) => sum + val, 0);
    const currentAttendance = attendanceData[0].data[attendanceData[0].data.length - (timePeriod === 'week' ? 2 : 1)];
    const totalAttendance = attendanceData.reduce((sum, line) => 
        sum + line.data[line.data.length - (timePeriod === 'week' ? 2 : 1)], 0
    );
    const attendanceRate = ((currentAttendance / totalAttendance) * 100).toFixed(1);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard Học sinh</h1>
                    <p className="text-xs text-gray-600 mt-1">Tổng quan thống kê và biểu đồ</p>
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

            
            <div className="flex items-stretch gap-4">
                {/* Charts Row 1 - Student Enrollment */}
                <div className='flex-1'>
                    <ChartCard
                        title="Thống kê Học sinh"
                        subtitle={`Học sinh mới và nghỉ học theo ${timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}`}
                        icon={Users}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                        labels={labels}
                        lines={enrollmentData}
                        height={200}
                    />
                </div>
                {/* Quick Stats */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <QuickStat
                        title="Tổng học sinh"
                        value={485}
                        percent="+5.2%"
                        isIncrease={true}
                        icon={Users}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <QuickStat
                        title="Học sinh mới"
                        value={totalNewStudents}
                        percent="+12.5%"
                        isIncrease={true}
                        icon={UserPlus}
                        iconBg="bg-green-100"
                        iconColor="text-green-600"
                    />
                    <QuickStat
                        title="Nghỉ học"
                        value={totalDropouts}
                        percent="-2.1%"
                        isIncrease={false}
                        icon={UserMinus}
                        iconBg="bg-red-100"
                        iconColor="text-red-600"
                    />
                    <QuickStat
                        title="Tỷ lệ điểm danh"
                        value={`${attendanceRate}%`}
                        percent="+1.8%"
                        isIncrease={true}
                        icon={CheckCircle}
                        iconBg="bg-purple-100"
                        iconColor="text-purple-600"
                    />
                </div>
            </div>

            {/* Charts Row 2 - Attendance and Tuition */}
            <div className="grid grid-cols-2 gap-4">
                <ChartCard
                    title="Thống kê Điểm danh"
                    subtitle={`Theo ${timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}`}
                    icon={Calendar}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    labels={labels}
                    lines={attendanceData}
                    height={200}
                />
                <ChartCard
                    title="Thống kê Học phí"
                    subtitle={`Theo ${timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}`}
                    icon={DollarSign}
                    iconBg="bg-yellow-100"
                    iconColor="text-yellow-600"
                    labels={labels}
                    lines={tuitionData}
                    height={200}
                />
            </div>
        </div>
    );
};
