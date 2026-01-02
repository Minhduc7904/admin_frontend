export const Textarea = ({
    name,
    value,
    onChange,
    placeholder,
    error,
    rows = 4,
    disabled = false,
    className = '',
}) => {
    return (
        <div>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 resize-none ${
                    error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-border focus:ring-info focus:border-transparent'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};
