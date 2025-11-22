import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputFieldProps {
    id: string;
    name: string;
    type: string;
    label: string;
    value: string;
    placeholder: string;
    icon: LucideIcon;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
    id,
    name,
    type,
    label,
    value,
    placeholder,
    icon: Icon,
    required = false,
    onChange,
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-2">
                {label}
            </label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};
