import React, { useState } from 'react';
import { QuickStat, ChartCard, type LineData } from '@/features/dashboard/components';
import { 
    GraduationCap, 
    Users,
    FileText,
    HelpCircle,
    Trophy,
    Folder,
    UserPlus,
    TrendingUp
} from 'lucide-react';
import { useAppSelector } from '@/core/store/hooks';
import { SUBJECTS } from '@/features/modules';

type TimePeriod = 'week' | 'month' | 'year';

export const EducationDashboard: React.FC = () => {
    const { selectedSubject } = useAppSelector((state) => state.module);
    const subjectInfo = SUBJECTS.find(s => s.id === selectedSubject);
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

    // Student activity data
    const getStudentActivityData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Học sinh mới',
                    color: '#10b981',
                    data: [12, 8, 15, 10, 18, 14, 20],
                },
                {
                    label: 'Hoạt động',
                    color: '#3b82f6',
                    data: [420, 435, 428, 445, 440, 455, 450],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Học sinh mới',
                    color: '#10b981',
                    data: [45, 52, 48, 55],
                },
                {
                    label: 'Hoạt động',
                    color: '#3b82f6',
                    data: [420, 445, 460, 485],
                },
            ];
        } else {
            return [
                {
                    label: 'Học sinh mới',
                    color: '#10b981',
                    data: [180, 165, 195, 175, 200, 185, 210, 190, 220, 205, 230, 215],
                },
                {
                    label: 'Hoạt động',
                    color: '#3b82f6',
                    data: [420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585],
                },
            ];
        }
    };

    // Exam and Session activity data
    const getExamActivityData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Đề thi mới',
                    color: '#6366f1',
                    data: [2, 1, 3, 2, 1, 2, 1],
                },
                {
                    label: 'Cuộc thi',
                    color: '#f59e0b',
                    data: [1, 0, 1, 1, 2, 1, 0],
                },
                {
                    label: 'Bài làm',
                    color: '#10b981',
                    data: [85, 92, 88, 95, 90, 98, 94],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Đề thi mới',
                    color: '#6366f1',
                    data: [8, 10, 7, 9],
                },
                {
                    label: 'Cuộc thi',
                    color: '#f59e0b',
                    data: [3, 4, 3, 5],
                },
                {
                    label: 'Bài làm',
                    color: '#10b981',
                    data: [340, 380, 360, 420],
                },
            ];
        } else {
            return [
                {
                    label: 'Đề thi mới',
                    color: '#6366f1',
                    data: [28, 32, 30, 35, 33, 38, 36, 40, 38, 42, 40, 45],
                },
                {
                    label: 'Cuộc thi',
                    color: '#f59e0b',
                    data: [12, 14, 13, 16, 15, 18, 17, 20, 19, 22, 21, 24],
                },
                {
                    label: 'Bài làm',
                    color: '#10b981',
                    data: [1200, 1350, 1280, 1450, 1380, 1520, 1450, 1600, 1550, 1680, 1620, 1750],
                },
            ];
        }
    };

    // Question bank data by difficulty
    const getQuestionBankData = (): LineData[] => {
        if (timePeriod === 'week') {
            return [
                {
                    label: 'Nhận biết',
                    color: '#10b981',
                    data: [15, 12, 18, 14, 20, 16, 22],
                },
                {
                    label: 'Thông hiểu',
                    color: '#3b82f6',
                    data: [12, 10, 14, 11, 16, 13, 18],
                },
                {
                    label: 'Vận dụng',
                    color: '#f59e0b',
                    data: [8, 6, 10, 7, 12, 9, 14],
                },
                {
                    label: 'Vận dụng cao',
                    color: '#ef4444',
                    data: [4, 3, 5, 4, 6, 5, 7],
                },
            ];
        } else if (timePeriod === 'month') {
            return [
                {
                    label: 'Nhận biết',
                    color: '#10b981',
                    data: [65, 72, 68, 78],
                },
                {
                    label: 'Thông hiểu',
                    color: '#3b82f6',
                    data: [52, 58, 55, 62],
                },
                {
                    label: 'Vận dụng',
                    color: '#f59e0b',
                    data: [38, 42, 40, 46],
                },
                {
                    label: 'Vận dụng cao',
                    color: '#ef4444',
                    data: [18, 20, 19, 22],
                },
            ];
        } else {
            return [
                {
                    label: 'Nhận biết',
                    color: '#10b981',
                    data: [280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445],
                },
                {
                    label: 'Thông hiểu',
                    color: '#3b82f6',
                    data: [220, 232, 244, 256, 268, 280, 292, 304, 316, 328, 340, 352],
                },
                {
                    label: 'Vận dụng',
                    color: '#f59e0b',
                    data: [160, 168, 176, 184, 192, 200, 208, 216, 224, 232, 240, 248],
                },
                {
                    label: 'Vận dụng cao',
                    color: '#ef4444',
                    data: [80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124],
                },
            ];
        }
    };

    const labels = getLabels();
    const studentActivityData = getStudentActivityData();
    const examActivityData = getExamActivityData();
    const questionBankData = getQuestionBankData();

    // Calculate totals for stats
    const totalNewStudents = studentActivityData[0].data.reduce((sum, val) => sum + val, 0);
    const totalExams = examActivityData[0].data.reduce((sum, val) => sum + val, 0);
    const totalQuestions = questionBankData.reduce((sum, line) => 
        sum + line.data[line.data.length - 1], 0
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Dashboard {subjectInfo?.name || 'Giáo dục'}
                    </h1>
                    <p className="text-xs text-gray-600 mt-1">
                        Tổng quan hoạt động giảng dạy và học tập
                    </p>
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

            {/* First Row - Student Activity Chart + Quick Stats */}
            <div className="flex items-stretch gap-4">
                {/* Charts Row 1 - Student Activity */}
                <div className='flex-1'>
                    <ChartCard
                        title="Hoạt động học sinh"
                        subtitle={`Học sinh mới và hoạt động theo ${timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}`}
                        icon={Users}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                        labels={labels}
                        lines={studentActivityData}
                        height={200}
                    />
                </div>
                {/* Quick Stats */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <QuickStat
                        title="Tổng lớp học"
                        value={24}
                        percent="+5.2%"
                        isIncrease={true}
                        icon={GraduationCap}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <QuickStat
                        title="Học sinh mới"
                        value={totalNewStudents}
                        percent="+12.8%"
                        isIncrease={true}
                        icon={UserPlus}
                        iconBg="bg-green-100"
                        iconColor="text-green-600"
                    />
                    <QuickStat
                        title="Tổng đề thi"
                        value={48}
                        percent="+8.5%"
                        isIncrease={true}
                        icon={FileText}
                        iconBg="bg-purple-100"
                        iconColor="text-purple-600"
                    />
                    <QuickStat
                        title="Ngân hàng câu hỏi"
                        value={totalQuestions}
                        percent="+15.3%"
                        isIncrease={true}
                        icon={HelpCircle}
                        iconBg="bg-orange-100"
                        iconColor="text-orange-600"
                    />
                </div>
            </div>

            {/* Charts Row 2 - Exam Activity and Question Bank */}
            <div className="grid grid-cols-2 gap-4">
                <ChartCard
                    title="Hoạt động thi cử"
                    subtitle={`Đề thi, cuộc thi và bài làm theo ${timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}`}
                    icon={Trophy}
                    iconBg="bg-yellow-100"
                    iconColor="text-yellow-600"
                    labels={labels}
                    lines={examActivityData}
                    height={200}
                />
                <ChartCard
                    title="Ngân hàng câu hỏi"
                    subtitle={`Câu hỏi mới theo độ khó - ${timePeriod === 'week' ? 'Tuần' : timePeriod === 'month' ? 'Tháng' : 'Năm'}`}
                    icon={HelpCircle}
                    iconBg="bg-indigo-100"
                    iconColor="text-indigo-600"
                    labels={labels}
                    lines={questionBankData}
                    height={200}
                />
            </div>
        </div>
    );
};
