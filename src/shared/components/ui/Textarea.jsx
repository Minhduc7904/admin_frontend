export const Textarea = ({
    name,
    value = '',
    onChange,
    placeholder,
    error,
    rows = 4,
    disabled = false,
    className = '',
    maxLength = 500,            // 👈 NEW
    showCount = true,     // 👈 NEW (có thể tắt)
}) => {
    const currentLength = value?.length || 0;
    const isLimitReached = maxLength && currentLength >= maxLength;

    return (
        <div className="space-y-1">
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 resize-none ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-border focus:ring-info focus:border-transparent'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
            />

            {/* Footer */}
            <div className="flex justify-between items-center">
                {error ? (
                    <p className="text-red-500 text-sm">{error}</p>
                ) : (
                    <span />
                )}

                {maxLength && showCount && (
                    <span
                        className={`text-xs ${isLimitReached
                                ? 'text-red-500 font-medium'
                                : 'text-foreground-lighter'
                            }`}
                    >
                        {currentLength}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
};
