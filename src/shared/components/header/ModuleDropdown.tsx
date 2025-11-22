import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Shield, GraduationCap, Users, Globe } from 'lucide-react';
import { MANAGEMENT_MODULES } from '@/features/modules/constants/modules.constants';
import { useAppSelector, useAppDispatch } from '@/core/store/hooks';
import { setSelectedModule, setSelectedSubject } from '@/features/modules/store/moduleSlice';
import { ROUTES } from '@/core/constants';
import type { ManagementModuleType } from '@/features/modules/types/module.types';

const iconMap = {
    Shield,
    GraduationCap,
    Users,
    Globe,
};

export const ModuleDropdown: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { selectedModule } = useAppSelector((state) => state.module);

    const currentModule = MANAGEMENT_MODULES.find(m => m.id === selectedModule);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleModuleChange = (moduleId: ManagementModuleType) => {
        const module = MANAGEMENT_MODULES.find(m => m.id === moduleId);
        
        // Update Redux state first
        dispatch(setSelectedModule(moduleId));
        
        // If module requires subject and no subject selected, set default to 'math'
        if (module?.requiresSubject) {
            dispatch(setSelectedSubject('math'));
        } else {
            // Clear subject if switching to non-education module
            dispatch(setSelectedSubject(null as any));
        }
        
        setIsOpen(false);
        
        // Always navigate to dashboard
        navigate(ROUTES.DASHBOARD);
    };

    const IconComponent = currentModule ? iconMap[currentModule.icon as keyof typeof iconMap] : Shield;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
                <IconComponent size={18} className="text-gray-700" />
                <span className="font-medium text-gray-900">{currentModule?.name || 'Chọn Module'}</span>
                <ChevronDown size={16} className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] py-2">
                    <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Chọn Module Quản Lý</p>
                    </div>
                    {MANAGEMENT_MODULES.map((module) => {
                        const Icon = iconMap[module.icon as keyof typeof iconMap];
                        const isActive = selectedModule === module.id;
                        
                        return (
                            <button
                                key={module.id}
                                onClick={() => handleModuleChange(module.id)}
                                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                                    isActive ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-700'} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className={`font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                                        {module.name}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">{module.description}</p>
                                </div>
                                {isActive && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
