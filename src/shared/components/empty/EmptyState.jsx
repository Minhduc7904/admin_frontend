import {
    FileQuestion,
    FolderOpen,
    Search,
    Inbox,
    AlertCircle,
    Database,
    Users,
    FileText,
    Image as ImageIcon,
    ShoppingCart,
    ClipboardList,
    ShieldCheck,
    Book
} from 'lucide-react';
import { Button } from '../ui';

/**
 * Icon mapping for different empty state types
 */
const ICON_MAP = {
    default: Inbox,
    search: Search,
    file: FileQuestion,
    folder: FolderOpen,
    alert: AlertCircle,
    database: Database,
    users: Users,
    document: FileText,
    image: ImageIcon,
    cart: ShoppingCart,
    clipboard_list: ClipboardList,
    shield_check: ShieldCheck,
    book: Book,
};

/**
 * EmptyState - Generic empty state component
 * Reusable component for showing "no data" states
 */
export const EmptyState = ({
    icon = 'default',
    iconSize = 48,
    title = 'Không có dữ liệu',
    description,
    actionLabel,
    onAction,
    actionIcon,
    secondaryActionLabel,
    onSecondaryAction,
    className = '',
    iconClassName = '',
    size = 'md',
    children,
}) => {
    const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] || ICON_MAP.default : icon;

    const sizeClasses = {
        sm: {
            container: 'py-6',
            icon: 'w-8 h-8',
            title: 'text-sm',
            description: 'text-xs',
        },
        md: {
            container: 'py-12',
            icon: 'w-12 h-12',
            title: 'text-base',
            description: 'text-sm',
        },
        lg: {
            container: 'py-16',
            icon: 'w-16 h-16',
            title: 'text-lg',
            description: 'text-base',
        },
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    return (
        <div className={`text-center ${currentSize.container} ${className}`}>
            {/* Icon */}
            <div className="flex justify-center mb-4">
                <IconComponent
                    className={`${currentSize.icon} text-gray-400 ${iconClassName}`}
                    strokeWidth={1.5}
                />
            </div>

            {/* Title */}
            <h3 className={`font-semibold text-foreground mb-2 ${currentSize.title}`}>
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className={`text-foreground-light max-w-md mx-auto mb-6 ${currentSize.description}`}>
                    {description}
                </p>
            )}

            {/* Custom children content */}
            {children && (
                <div className="mb-6">
                    {children}
                </div>
            )}

            {/* Actions */}
            {(actionLabel || secondaryActionLabel) && (
                <div className="flex items-center justify-center gap-3">
                    {actionLabel && onAction && (
                        <Button onClick={onAction}>
                            {actionIcon && <span className="mr-2">{actionIcon}</span>}
                            {actionLabel}
                        </Button>
                    )}
                    {secondaryActionLabel && onSecondaryAction && (
                        <Button variant="outline" onClick={onSecondaryAction}>
                            {secondaryActionLabel}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * EmptyTable - Empty state specifically for tables
 */
export const EmptyTable = ({
    title = 'Không có dữ liệu',
    description = 'Chưa có bản ghi nào trong bảng',
    actionLabel,
    onAction,
    icon = 'database',
    columns = 1,
}) => {
    return (
        <tr>
            <td colSpan={columns} className="px-4 py-10">
                <div className="w-full flex justify-center">
                    <EmptyState
                        icon={icon}
                        title={title}
                        description={description}
                        actionLabel={actionLabel}
                        onAction={onAction}
                        size="md"
                    />
                </div>
            </td>
        </tr>
    );
};


/**
 * EmptyList - Empty state for lists
 */
export const EmptyList = ({
    title = 'Danh sách trống',
    description,
    actionLabel,
    onAction,
    icon = 'folder',
    showBorder = true,
}) => {
    const content = (
        <EmptyState
            icon={icon}
            title={title}
            description={description}
            actionLabel={actionLabel}
            onAction={onAction}
            size="md"
        />
    );

    if (!showBorder) {
        return content;
    }

    return (
        <div className="border border-border rounded-sm bg-white p-4">
            {content}
        </div>
    );
};

/**
 * EmptySearch - Empty state for search results
 */
export const EmptySearch = ({
    searchTerm,
    onClear,
    onReset,
    suggestions = [],
}) => {
    return (
        <EmptyState
            icon="search"
            title="Không tìm thấy kết quả"
            description={
                searchTerm
                    ? `Không tìm thấy kết quả cho "${searchTerm}"`
                    : 'Không có kết quả phù hợp với tìm kiếm của bạn'
            }
            actionLabel={onClear ? 'Xóa tìm kiếm' : undefined}
            onAction={onClear}
            secondaryActionLabel={onReset ? 'Đặt lại bộ lọc' : undefined}
            onSecondaryAction={onReset}
            size="md"
        >
            {suggestions && suggestions.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-foreground-light mb-2">Gợi ý tìm kiếm:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => suggestion.onClick?.()}
                                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-foreground transition-colors"
                            >
                                {suggestion.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </EmptyState>
    );
};

/**
 * EmptyCard - Empty state for cards/boxes
 */
export const EmptyCard = ({
    title = 'Không có dữ liệu',
    description,
    icon = 'default',
    actionLabel,
    onAction,
    className = '',
}) => {
    return (
        <div className={`bg-white border border-border rounded-sm p-6 ${className}`}>
            <EmptyState
                icon={icon}
                title={title}
                description={description}
                actionLabel={actionLabel}
                onAction={onAction}
                size="sm"
            />
        </div>
    );
};

/**
 * EmptyInline - Compact empty state for inline use
 */
export const EmptyInline = ({
    message = 'Không có dữ liệu',
    icon,
    className = '',
}) => {
    const IconComponent = icon ? (typeof icon === 'string' ? ICON_MAP[icon] : icon) : null;

    return (
        <div className={`flex items-center justify-center gap-2 py-4 text-foreground-light ${className}`}>
            {IconComponent && <IconComponent className="w-4 h-4" />}
            <span className="text-sm">{message}</span>
        </div>
    );
};

/**
 * EmptyPage - Full page empty state
 */
export const EmptyPage = ({
    icon = 'default',
    title = 'Không có dữ liệu',
    description,
    actionLabel,
    onAction,
    actionIcon,
    secondaryActionLabel,
    onSecondaryAction,
}) => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <EmptyState
                icon={icon}
                title={title}
                description={description}
                actionLabel={actionLabel}
                onAction={onAction}
                actionIcon={actionIcon}
                secondaryActionLabel={secondaryActionLabel}
                onSecondaryAction={onSecondaryAction}
                size="lg"
            />
        </div>
    );
};

/**
 * Default export
 */
export default EmptyState;
