import React from 'react';
import { X } from 'lucide-react';
import { Calculator, Atom, FlaskConical, BookOpen, Leaf, Languages } from 'lucide-react';
import type { Subject } from '../types/module.types';

interface SubjectModalProps {
    subjects: Subject[];
    onSelect: (subjectId: string) => void;
    onClose: () => void;
}

const iconMap = {
    Calculator,
    Atom,
    FlaskConical,
    BookOpen,
    Leaf,
    Languages,
};

export const SubjectModal: React.FC<SubjectModalProps> = ({ subjects, onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Chọn môn học</h2>
                        <p className="text-gray-600 text-sm mt-1">Vui lòng chọn môn học để tiếp tục</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Subject Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => {
                        const IconComponent = iconMap[subject.icon as keyof typeof iconMap];
                        return (
                            <div
                                key={subject.id}
                                onClick={() => onSelect(subject.id)}
                                className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-black hover:shadow-lg transition-all group"
                            >
                                {/* Icon with color */}
                                <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <IconComponent className="text-white" size={24} />
                                </div>

                                {/* Name */}
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{subject.name}</h3>
                                <p className="text-sm text-gray-600">{subject.nameEn}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
