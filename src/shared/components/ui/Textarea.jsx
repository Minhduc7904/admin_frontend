export const Textarea = ({
    label,
    name,
    id,
    value = '',
    onChange,
    placeholder,
    disabled = false,
    required = false,
    helperText,
    error,
    rows = 4,
    className = '',
    maxLength = 500,
    showCount = true,
    ...props
}) => {
    const textareaId = id || name
    const currentLength = value?.length || 0
    const isLimitReached = maxLength && currentLength >= maxLength

    return (
        <div>
            {/* Label */}
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-foreground mb-1"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Textarea */}
            <textarea
                id={textareaId}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                maxLength={maxLength}
                className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none resize-none
          ${error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-border focus:border-foreground'
                    }
          ${disabled
                        ? 'bg-gray-50 text-foreground-light cursor-not-allowed'
                        : 'bg-primary'
                    }
          ${className}
        `}
                {...props}
            />

            {/* Footer */}
            <div className="flex justify-between items-center mt-1">
                {/* Error / Helper */}
                <div>
                    {error && (
                        <p className="text-xs text-red-500">{error}</p>
                    )}
                    {!error && helperText && (
                        <p className="text-xs text-foreground-light">{helperText}</p>
                    )}
                </div>

                {/* Counter */}
                {maxLength && showCount && (
                    <span
                        className={`text-xs ${isLimitReached
                                ? 'text-red-500 font-medium'
                                : 'text-foreground-light'
                            }`}
                    >
                        {currentLength}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    )
}
