import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, HelpCircle, GraduationCap, Video, CheckSquare, BarChart2, Folder, Calculator, Atom, FlaskConical, Leaf, Languages, Trophy } from 'lucide-react';
import { useAppSelector } from '@/core/store/hooks';
import { SUBJECTS } from '@/features/modules';
import { ROUTES } from '@/core/constants';
import { Sidebar, type SidebarMenuItem } from './Sidebar';

const iconMap = {
    Calculator,
    Atom,
    FlaskConical,
    BookOpen,
    Leaf,
    Languages,
};

export const EducationSidebar: React.FC = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = React.useState<string>('overview');
    const { selectedSubject } = useAppSelector((state) => state.module);
    const subjectInfo = SUBJECTS.find(s => s.id === selectedSubject);
    
    const IconComponent = subjectInfo?.icon ? iconMap[subjectInfo.icon as keyof typeof iconMap] : null;

    const menuItems: SidebarMenuItem[] = [
        { id: 'overview', icon: <BarChart2 size={20} />, label: 'Tổng quan' },
        { id: 'classes', icon: <GraduationCap size={20} />, label: 'Lớp học', badge: '24' },
        // { id: 'lessons', icon: <BookOpen size={20} />, label: 'Bài giảng', badge: '156' },
        { id: 'exams', icon: <FileText size={20} />, label: 'Đề thi', badge: '48' },
        { id: 'exam-sessions', icon: <Trophy size={20} />, label: 'Cuộc thi', badge: '12' },
        { id: 'questions', icon: <HelpCircle size={20} />, label: 'Ngân hàng câu hỏi', badge: '1.2K' },
        // { id: 'videos', icon: <Video size={20} />, label: 'Video bài giảng' },
        // { id: 'assignments', icon: <CheckSquare size={20} />, label: 'Bài tập', badge: '32' },
        { id: 'materials', icon: <Folder size={20} />, label: 'Tài liệu' },
    ];

    const headerContent = (
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subjectInfo?.color || 'bg-blue-100'}`}>
                {IconComponent && <IconComponent size={20} className="text-white" />}
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-900">{subjectInfo?.name}</h2>
                <p className="text-xs text-gray-600">{subjectInfo?.nameEn}</p>
            </div>
        </div>
    );

    const footerContent = (
        <div className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
                <span>Lớp học:</span>
                <span className="font-semibold text-gray-900">24</span>
            </div>
            <div className="flex justify-between">
                <span>Học sinh:</span>
                <span className="font-semibold text-gray-900">485</span>
            </div>
            <div className="flex justify-between">
                <span>Câu hỏi:</span>
                <span className="font-semibold text-gray-900">1.2K</span>
            </div>
        </div>
    );

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
        if (itemId === 'overview') {
            navigate(ROUTES.EDUCATION.DASHBOARD);
        } else if (itemId === 'classes') {
            navigate('/education/classes');
        } else if (itemId === 'exams') {
            navigate('/education/exams');
        } else if (itemId === 'exam-sessions') {
            navigate('/education/exam-sessions');
        } else if (itemId === 'questions') {
            navigate('/education/questions');
        } else if (itemId === 'materials') {
            navigate('/education/materials');
        }
    };

    return (
        <Sidebar
            title={subjectInfo?.name || 'Học tập'}
            menuItems={menuItems}
            activeItem={activeItem}
            onItemClick={handleItemClick}
            headerContent={headerContent}
            footerContent={footerContent}
        />
    );
};
