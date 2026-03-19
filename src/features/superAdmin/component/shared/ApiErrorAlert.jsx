import { AlertTriangle } from 'lucide-react';

export const ApiErrorAlert = ({ message }) => {
    if (!message) return null;

    return (
        <div className="flex items-start gap-2 text-sm rounded-sm border border-red-200 bg-red-50 text-red-700 px-3 py-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{message}</span>
        </div>
    );
};
