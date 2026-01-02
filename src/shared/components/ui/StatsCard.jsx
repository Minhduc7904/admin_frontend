export const StatsCard = ({ label, value, variant = 'default', loading = false }) => {
    const variantColors = {
        default: 'text-foreground',
        primary: 'text-blue-600',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
    };

    if (loading) {
        return (
            <div className="bg-white border border-border rounded-sm p-4">
                <div className="h-4 bg-gray-200 rounded-sm animate-pulse w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded-sm animate-pulse w-1/3"></div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-border rounded-sm p-4">
            <div className="text-sm text-foreground-light mb-1">{label}</div>
            <div className={`text-2xl font-bold ${variantColors[variant]}`}>
                {value}
            </div>
        </div>
    );
};

export const StatsGrid = ({ children, cols = 3, className = '' }) => {
    const colsClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5',
    };

    return (
        <div className={`grid grid-cols-1 ${colsClass[cols]} gap-4 ${className}`}>
            {children}
        </div>
    );
};
