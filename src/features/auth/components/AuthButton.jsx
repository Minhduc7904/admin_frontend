export const AuthButton = ({ 
  children, 
  type = 'button', 
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  icon
}) => {
  const baseClasses = 'px-3 py-2 text-sm font-medium rounded-sm transition-colors flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-foreground text-white border hover:bg-gray-800 disabled:bg-gray-400',
    success: 'bg-success text-white hover:bg-success-dark disabled:bg-gray-400',
    error: 'bg-error text-white hover:bg-error-dark disabled:bg-gray-400',
    outline: 'border border-border text-foreground hover:bg-gray-50 disabled:text-gray-400',
    ghost: 'text-foreground hover:bg-gray-50 disabled:text-gray-400'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${widthClass}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
