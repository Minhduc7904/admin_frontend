import React from 'react';
import { Square, CheckSquare } from 'lucide-react';

interface CheckboxProps {
    label?: string;
    variant?: 'default' | 'success' | 'primary';
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    variant = 'default',
    className = '',
    checked = false,
    onChange,
    disabled = false,
}) => {
    const variantStyles = {
        default: 'text-gray-900 hover:text-gray-700',
        success: 'text-green-600 hover:text-green-700',
        primary: 'text-blue-600 hover:text-blue-700',
    };

    const handleClick = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    return (
        <label 
            className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} group`}
            onClick={handleClick}
        >
            <div className="relative">
                {checked ? (
                    <CheckSquare 
                        size={18} 
                        className={`
                            transition-all duration-200
                            ${disabled ? '' : variantStyles[variant]}
                            ${className}
                        `}
                        strokeWidth={2}
                    />
                ) : (
                    <Square 
                        size={18} 
                        className={`
                            text-gray-400 
                            transition-all duration-200
                            ${disabled ? '' : 'group-hover:text-gray-600'}
                            ${className}
                        `}
                        strokeWidth={2}
                    />
                )}
            </div>
            {label && (
                <span className={`text-sm text-gray-700 transition-colors select-none ${disabled ? '' : 'group-hover:text-gray-900'}`}>
                    {label}
                </span>
            )}
        </label>
    );
};
