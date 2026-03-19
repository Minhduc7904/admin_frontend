import { ChevronDown, ChevronUp } from 'lucide-react';

export const ApiEndpointCard = ({
    isOpen,
    onToggle,
    method = 'POST',
    path,
    description,
    methodClassName = 'bg-green-600',
    headerClassName = 'bg-green-50 hover:bg-green-100',
    pathClassName = 'text-green-800',
    children,
}) => {
    return (
        <section className="border border-border rounded-sm bg-white overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className={`w-full px-4 py-3 border-b border-border flex items-center justify-between gap-4 transition-colors ${headerClassName}`}
            >
                <div className="flex items-center gap-3 flex-wrap text-left">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-semibold text-white ${methodClassName}`}>
                        {method}
                    </span>
                    <code className={`text-sm font-medium ${pathClassName}`}>
                        {path}
                    </code>
                    <span className="text-xs text-foreground-light">
                        {description}
                    </span>
                </div>
                {isOpen ? (
                    <ChevronUp size={16} className="shrink-0" />
                ) : (
                    <ChevronDown size={16} className="shrink-0" />
                )}
            </button>

            {isOpen && <div className="p-4 space-y-6">{children}</div>}
        </section>
    );
};
