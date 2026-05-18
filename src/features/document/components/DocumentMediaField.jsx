import { FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const DocumentMediaField = ({
    label,
    value,
    type,
    onOpen,
    onClear,
    required = false,
    helperText,
    error,
}) => {
    const Icon = type === 'image' ? ImageIcon : FileText;

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`rounded-sm border p-3 ${error ? 'border-red-500' : 'border-border'}`}>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gray-50">
                            <Icon size={18} className="text-foreground-light" />
                        </div>
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-foreground">
                                {value ? `Media #${value}` : 'Chưa chọn media'}
                            </div>
                            {helperText && <div className="text-xs text-foreground-light">{helperText}</div>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {value && (
                            <Button type="button" variant="outline" onClick={onClear}>
                                Bỏ chọn
                            </Button>
                        )}
                        <Button type="button" onClick={onOpen}>
                            Chọn media
                        </Button>
                    </div>
                </div>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};
