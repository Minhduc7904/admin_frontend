export const formatJson = (value) => JSON.stringify(value, null, 2);

export const ApiJsonPreview = ({
    title,
    value,
    className = 'text-xs bg-gray-900 text-emerald-300 rounded-sm p-3 overflow-auto border border-gray-800',
}) => {
    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground-light uppercase tracking-wide">{title}</p>
            <pre className={className}>
                {formatJson(value)}
            </pre>
        </div>
    );
};
