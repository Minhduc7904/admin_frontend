export const Input = ({
  label,
  type = 'text',
  name,
  id,
  value,
  onChange,
  disabled = false,
  placeholder,
  required = false,
  helperText,
  error,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-border focus:border-foreground'
        } ${
          disabled
            ? 'bg-gray-50 text-foreground-light cursor-not-allowed'
            : 'bg-primary'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-foreground-light mt-1">{helperText}</p>
      )}
    </div>
  );
};
