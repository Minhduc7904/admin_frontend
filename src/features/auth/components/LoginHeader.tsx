import React from 'react';
import { Lock } from 'lucide-react';

interface LoginHeaderProps {
    title: string;
    subtitle: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4">
                <Lock className="w-10 h-10 text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    );
};
