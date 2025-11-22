import React from 'react';
import { Shield, GraduationCap, Users, Globe, ArrowRight } from 'lucide-react';
import type { ManagementModule } from '../types/module.types';

interface ModuleCardProps {
    module: ManagementModule;
    onSelect: (moduleId: string) => void;
}

const iconMap = {
    Shield,
    GraduationCap,
    Users,
    Globe,
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onSelect }) => {
    const IconComponent = iconMap[module.icon as keyof typeof iconMap];

    return (
        <div
            onClick={() => onSelect(module.id)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-2 border-gray-100 hover:border-black group"
        >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-4 group-hover:bg-black transition-colors">
                <IconComponent className="text-gray-900 group-hover:text-white transition-colors" size={32} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{module.name}</h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">{module.description}</p>

            {/* Features */}
            <div className="space-y-2 mb-4">
                {module.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            {/* Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-900">Chọn module</span>
                <ArrowRight className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" size={20} />
            </div>
        </div>
    );
};
