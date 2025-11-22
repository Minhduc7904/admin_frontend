import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ModuleCard, SubjectModal } from '../components';
import { MANAGEMENT_MODULES, SUBJECTS } from '../constants/modules.constants';
import { ROUTES } from '@/core/constants';
import { useAppDispatch } from '@/core/store/hooks';
import { setSelectedModule, setSelectedSubject } from '../store/moduleSlice';
import type { ManagementModuleType, SubjectType } from '../types/module.types';

export const ModuleSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [selectedModuleLocal, setSelectedModuleLocal] = useState<ManagementModuleType | null>(null);

    const handleModuleSelect = (moduleId: string) => {
        const module = MANAGEMENT_MODULES.find(m => m.id === moduleId);
        
        if (module?.requiresSubject) {
            // Nếu module yêu cầu chọn môn học, hiển thị modal
            setSelectedModuleLocal(moduleId as ManagementModuleType);
            setShowSubjectModal(true);
        } else {
            // Nếu không cần chọn môn, chuyển thẳng đến dashboard của module
            navigateToModule(moduleId as ManagementModuleType);
        }
    };

    const handleSubjectSelect = (subjectId: string) => {
        if (selectedModuleLocal) {
            // Update Redux state
            dispatch(setSelectedSubject(subjectId as SubjectType));
            
            // Lưu thông tin module và subject vào localStorage
            localStorage.setItem('selectedModule', selectedModuleLocal);
            localStorage.setItem('selectedSubject', subjectId);
            
            // Navigate đến dashboard với module và subject
            navigateToModule(selectedModuleLocal, subjectId);
        }
    };

    const navigateToModule = (moduleId: ManagementModuleType, subjectId?: string) => {
        // Update Redux state (quan trọng!)
        dispatch(setSelectedModule(moduleId));
        
        // Lưu thông tin module vào localStorage
        localStorage.setItem('selectedModule', moduleId);
        
        if (subjectId) {
            dispatch(setSelectedSubject(subjectId as SubjectType));
            localStorage.setItem('selectedSubject', subjectId);
        }
        
        // Navigate đến dashboard
        navigate(ROUTES.DASHBOARD);
    };

    const handleLogout = () => {
        // Clear storage
        localStorage.clear();
        // Navigate to login
        navigate(ROUTES.AUTH.LOGIN);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Chọn Module Quản Lý</h1>
                            <p className="text-gray-600 mt-1">Vui lòng chọn module bạn muốn quản lý</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Module Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MANAGEMENT_MODULES.map((module) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            onSelect={handleModuleSelect}
                        />
                    ))}
                </div>
            </div>

            {/* Subject Selection Modal */}
            {showSubjectModal && (
                <SubjectModal
                    subjects={SUBJECTS}
                    onSelect={handleSubjectSelect}
                    onClose={() => {
                        setShowSubjectModal(false);
                        setSelectedModuleLocal(null);
                    }}
                />
            )}
        </div>
    );
};
