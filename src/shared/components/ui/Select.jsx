import { Dropdown } from './Dropdown';

export const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Chọn...',
    disabled = false,
    error = '',
    helperText = '',
    required = false,
    className = ''
}) => {
    const handleChange = (selectedValue) => {
        if (onChange) {
            // Tạo event object giống như native select
            const event = {
                target: {
                    name,
                    value: selectedValue
                }
            };
            onChange(event);
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <Dropdown
                value={value}
                onChange={handleChange}
                options={options}
                placeholder={placeholder}
                disabled={disabled}
            />

            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}

            {helperText && !error && (
                <p className="text-sm text-foreground-light mt-1">{helperText}</p>
            )}
        </div>
    );
};
