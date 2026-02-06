import { Eye, FileText } from 'lucide-react';

/**
 * ViewModeToggle Component
 * Reusable component for toggling between preview and text view modes
 */
export const ViewModeToggle = ({ 
    viewMode = 'preview', 
    onChange,
    className = '' 
}) => {
    return (
        <div className={`flex items-center gap-1 bg-gray-100 rounded p-0.5 ${className}`}>
            <button
                onClick={() => onChange('preview')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    viewMode === 'preview'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-foreground-light hover:text-foreground'
                }`}
                title="Xem dạng markdown"
            >
                <Eye className="w-3 h-3" />
                Preview
            </button>

            <button
                onClick={() => onChange('text')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    viewMode === 'text'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-foreground-light hover:text-foreground'
                }`}
                title="Xem dạng text thô"
            >
                <FileText className="w-3 h-3" />
                Text
            </button>
        </div>
    );
};
