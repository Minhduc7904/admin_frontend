import { InfoTooltip } from './InfoTooltip';

/**
 * LabelWithTooltip - Component hiển thị label với optional tooltip
 * @param {string} label - Label text
 * @param {boolean} required - Hiển thị dấu * bắt buộc
 * @param {string} tooltipText - Nội dung tooltip (optional)
 * @param {string} tooltipPosition - Vị trí tooltip: 'top', 'bottom', 'left', 'right'
 * @param {string} htmlFor - ID của input element
 * @param {string} className - Custom className cho label
 */
export const LabelWithTooltip = ({ 
    label,
    required = false,
    tooltipText,
    tooltipPosition = 'top',
    htmlFor,
    className = ''
}) => {
    if (!label) return null;

    return (
        <div className="flex items-center gap-2 mb-1">
            <label
                htmlFor={htmlFor}
                className={`block text-sm font-medium text-foreground ${className}`}
            >
                {label} {required && <span className="text-red-500">*</span>}
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
