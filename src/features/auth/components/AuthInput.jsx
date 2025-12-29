export const AuthInput = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error
}) => {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 text-sm border ${error ? 'border-error' : 'border-border'
                    } rounded-sm focus:outline-none focus:border-foreground bg-primary transition-colors`}
                placeholder={placeholder}
                required={required}
            />
            {error && (
                <p className="mt-1 text-xs text-error">{error}</p>
            )}
        </div>
    );
};
