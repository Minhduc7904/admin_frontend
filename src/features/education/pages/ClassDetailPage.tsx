import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    ClassDetailHeader,
    ClassDetailTabs,
    ClassInfoTab,
    ClassStudentsTab,
    ClassLessonsTab,
    ClassAttendanceTab,
    ClassTuitionTab,
} from '@/features/education/components/classDetail';

type TabType = 'info' | 'students' | 'attendance' | 'lessons' | 'schedule' | 'tuition';

interface ClassInfo {
    id: string;
    name: string;
    classCode: string;
    subject: string;
    grade: string;
    teacher: string;
    teacherEmail: string;
    teacherPhone: string;
    studentCount: number;
    room: string;
    schedule: string;
    academicYear: string;
    semester: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed' | 'archived';
    description?: string;
}

export const ClassDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('info');

    // Mock data
    const classInfo: ClassInfo = {
        id: id || '1',
        name: '12A1',
        classCode: 'LH001',
        subject: 'Toán',
        grade: 'Khối 12',
        teacher: 'Nguyễn Thị Lan',
        teacherEmail: 'nguyenthilan@school.edu.vn',
        teacherPhone: '0987654321',
        studentCount: 38,
        room: 'A201',
        schedule: 'Thứ 2, 4, 6 - 7h00-8h30',
        academicYear: '2024-2025',
        semester: 'HK1',
        startDate: '01/09/2024',
        endDate: '31/12/2024',
        status: 'active',
        description: 'Lớp học Toán nâng cao dành cho học sinh khối 12, tập trung vào các chuyên đề đại số, giải tích và hình học không gian.',
    };

    // Handlers
    const handleEdit = () => {
        console.log('Edit class info');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <ClassInfoTab classInfo={classInfo} onEdit={handleEdit} />;
            case 'students':
                return <ClassStudentsTab classId={classInfo.id} />;
            case 'attendance':
                return <ClassAttendanceTab classId={classInfo.id} />;
            case 'lessons':
                return <ClassLessonsTab classId={classInfo.id} />;
            case 'schedule':
                return <div className="p-4 text-center text-gray-500">Tab Lịch học đang được phát triển</div>;
            case 'tuition':
                return <ClassTuitionTab classId={classInfo.id} />;
            default:
                return null;
        }
    };

    return (
        <>
            <ClassDetailHeader />
            <ClassDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderTabContent()}
        </>
    );
};
