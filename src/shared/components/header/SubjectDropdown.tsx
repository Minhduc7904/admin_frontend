import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calculator, Atom, FlaskConical, BookOpen, Leaf, Languages } from 'lucide-react';
import { SUBJECTS } from '@/features/modules/constants/modules.constants';
import { useAppSelector, useAppDispatch } from '@/core/store/hooks';
import { setSelectedSubject } from '@/features/modules/store/moduleSlice';
import type { SubjectType } from '@/features/modules/types/module.types';

const iconMap = {
    Calculator,
    Atom,
    FlaskConical,
    BookOpen,
    Leaf,
    Languages,
};

export const SubjectDropdown: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { selectedSubject, selectedModule } = useAppSelector((state) => state.module);

    const currentSubject = SUBJECTS.find(s => s.id === selectedSubject);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubjectChange = (subjectId: SubjectType) => {
        dispatch(setSelectedSubject(subjectId));
        setIsOpen(false);
    };

    // Only show if education module is selected
    if (selectedModule !== 'education') {
        return null;
    }

    const IconComponent = currentSubject ? iconMap[currentSubject.icon as keyof typeof iconMap] : BookOpen;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
                <IconComponent size={18} className="text-blue-600" />
                <span className="font-medium text-gray-900">{currentSubject?.name || 'Chọn môn'}</span>
                <ChevronDown size={16} className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                    <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Chọn Môn Học</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2">
                        {SUBJECTS.map((subject) => {
                            const Icon = iconMap[subject.icon as keyof typeof iconMap];
                            const isActive = selectedSubject === subject.id;
                            
                            return (
                                <button
                                    key={subject.id}
                                    onClick={() => handleSubjectChange(subject.id)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 ${
                                        isActive ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                                    }`}
                                >
                                    <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center`}>
                                        <Icon size={20} className="text-white" />
                                    </div>
                                    <div className="text-center">
                                        <p className={`font-semibold text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                                            {subject.name}
                                        </p>
                                        <p className="text-xs text-gray-600">{subject.nameEn}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
