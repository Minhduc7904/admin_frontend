import { Check } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const Checkbox = ({
  checked = false,
  onChange,
  label,
  id,
  className = '',
  tooltipText,
  tooltipPosition = 'right',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div
          className={`
            w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
            ${checked
              ? 'bg-foreground border-foreground'
              : 'bg-white border-border hover:border-foreground-light'
            }
          `}
        >
          {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        {label && (
          <span className="ml-2 text-sm text-foreground-light select-none shrink-0">
            {label}
          </span>
        )}
      </label>
      {tooltipText && (
        <InfoTooltip
          text={tooltipText}
          position={tooltipPosition}
        />
      )}
    </div>
  );
};
