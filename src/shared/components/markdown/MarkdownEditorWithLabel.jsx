import { LabelWithTooltip } from '../ui/LabelWithTooltip';
import { MarkdownEditorPreview as BaseMarkdownEditor } from './MarkdownEditorPreview';

/**
 * MarkdownEditorWithLabel - Wrapper for MarkdownEditorPreview with label and tooltip support
 */
export const MarkdownEditorWithLabel = ({
    label,
    required = false,
    tooltipText,
    tooltipPosition = 'top',
    error,
    ...props
}) => {
    return (
        <div>
            <LabelWithTooltip
                label={label}
                required={required}
                tooltipText={tooltipText}
                tooltipPosition={tooltipPosition}
            />
            <BaseMarkdownEditor {...props} />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
