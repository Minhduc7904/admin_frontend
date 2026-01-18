import { useState } from 'react';
import { Input } from '../../../shared/components';

/**
 * ChapterMultiSelect - Component for selecting multiple chapters
 * TODO: Implement full functionality with chapter API
 */
export const ChapterMultiSelect = ({
    label,
    placeholder = "Chọn chương...",
    value = [],
    onSelect,
    error,
    helperText,
}) => {
    const [inputValue, setInputValue] = useState('');

    return (
        <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
                {label}
            </label>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                error={error}
                helperText={helperText || "Tính năng này đang được phát triển"}
                disabled={true}
            />
            {value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {value.map((chapterId) => (
                        <span
                            key={chapterId}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                        >
                            Chapter {chapterId}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
