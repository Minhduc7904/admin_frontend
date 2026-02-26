import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { InlineLoading } from '../loading/Loading';
import { EmptyInline } from '../empty/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * SearchableSelect - Generic search component with dropdown
 * 
 * @param {Object} props
 * @param {string} props.label - Label hiển thị phía trên
 * @param {string} props.placeholder - Placeholder cho input
 * @param {Function} props.onSelect - Callback khi chọn item: (item) => void
 * @param {Function} props.searchFunction - Async function search: (keyword) => Promise<{data: []}>
 * @param {Function} props.fetchDefaultItems - Async function lấy danh sách mặc định: () => Promise<{data: []}>
 * @param {Function} props.getOptionLabel - Function lấy label hiển thị: (item) => string
 * @param {Function} props.getOptionValue - Function lấy value: (item) => any
 * @param {Function} props.renderOption - Optional custom render option: (item) => ReactNode
 * @param {any} props.value - Selected value (để hiển thị selected item)
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Bắt buộc chọn
 * @param {boolean} props.disabled - Disable component
 * @param {string} props.className - Custom className
 * @param {number} props.debounceMs - Debounce time (default: 300ms)
 */
export const SearchableSelect = ({
    label,
    placeholder = 'Tìm kiếm...',
    onSelect,
    searchFunction,
    fetchDefaultItems,
    getOptionLabel = (item) => item?.name || item?.title || String(item),
    getOptionValue = (item) => item?.id || item,
    renderOption,
    value,
    error,
    required = false,
    disabled = false,
    className = '',
    debounceMs = 300,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const containerRef = useRef(null);

    // Use debounce hook
    const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

    // Close dropdown when click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load default items when dropdown opens
    useEffect(() => {
        if (isOpen && !searchTerm && options.length === 0) {
            loadDefaultItems();
        }
    }, [isOpen]);

    // Search when debounced search term changes
    useEffect(() => {
        if (!isOpen) return;

        if (debouncedSearchTerm) {
            handleSearch(debouncedSearchTerm);
        } else {
            loadDefaultItems();
        }
    }, [debouncedSearchTerm, isOpen]);

    // Update selected item when value changes
    useEffect(() => {
        if (value === null || value === undefined) {
            setSelectedItem(null);
            return;
        }
        // value is a full object — set directly
        if (typeof value === 'object') {
            setSelectedItem(value);
            return;
        }
        // value is a primitive (ID) — find in loaded options
        if (options.length > 0) {
            const item = options.find(opt => getOptionValue(opt) === value);
            if (item) {
                setSelectedItem(item);
            }
        }
    }, [value, options]);

    const loadDefaultItems = async () => {
        if (!fetchDefaultItems) return;

        setLoading(true);
        try {
            const result = await fetchDefaultItems();
            const items = result?.data || result || [];
            setOptions(items);
        } catch (error) {
            console.error('Error loading default items:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (keyword) => {
        if (!searchFunction) return;

        setLoading(true);
        try {
            const result = await searchFunction(keyword);
            const items = result?.data || result || [];

            // Fallback to default items if no results
            if (items.length === 0 && fetchDefaultItems) {
                const defaultResult = await fetchDefaultItems();
                const defaultItems = defaultResult?.data || defaultResult || [];
                setOptions(defaultItems);
            } else {
                setOptions(items);
            }
        } catch (error) {
            console.error('Error searching:', error);
            // Try fallback on error
            if (fetchDefaultItems) {
                try {
                    const defaultResult = await fetchDefaultItems();
                    const defaultItems = defaultResult?.data || defaultResult || [];
                    setOptions(defaultItems);
                } catch (fallbackError) {
                    console.error('Error loading fallback items:', fallbackError);
                    setOptions([]);
                }
            } else {
                setOptions([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setIsOpen(false);
        setSearchTerm('');
        onSelect?.(item);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setSelectedItem(null);
        setSearchTerm('');
        setOptions([]);
        onSelect?.(null);
    };

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Main Input/Display */}
            <div
                onClick={handleToggle}
                className={`
          w-full px-3 py-2 text-sm border rounded-sm cursor-pointer
          flex items-center justify-between gap-2
          ${error ? 'border-red-500' : 'border-border'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-primary hover:border-foreground'}
          ${isOpen ? 'border-foreground' : ''}
        `}
            >
                <div className="flex-1 flex items-center gap-2 overflow-hidden">
                    <Search className="w-4 h-4 text-foreground-light flex-shrink-0" />
                    {selectedItem ? (
                        <span className="truncate text-foreground">
                            {getOptionLabel(selectedItem)}
                        </span>
                    ) : (
                        <span className="text-foreground-light">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {selectedItem && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-0.5 hover:bg-gray-200 rounded"
                        >
                            <X className="w-4 h-4 text-foreground-light" />
                        </button>
                    )}
                    <ChevronDown
                        className={`w-4 h-4 text-foreground-light transition-transform ${isOpen ? 'transform rotate-180' : ''
                            }`}
                    />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-sm shadow-lg max-h-64 overflow-hidden flex flex-col">
                    {/* Search Input */}
                    <div className="p-2 border-b border-border">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập từ khóa tìm kiếm..."
                            className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground"
                            autoFocus
                        />
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className='flex w-full justify-center items-center'><InlineLoading message="Đang tải..." /></div>
                        ) : options.length === 0 ? (
                            <EmptyInline
                                icon="search"
                                message="Không tìm thấy kết quả"
                            />
                        ) : (
                            <ul className="py-1">
                                {options.map((item, index) => {
                                    const isSelected = selectedItem && getOptionValue(selectedItem) === getOptionValue(item);

                                    return (
                                        <li
                                            key={getOptionValue(item) || index}
                                            onClick={() => handleSelectItem(item)}
                                            className={`
                        px-4 py-2 text-sm cursor-pointer transition-colors
                        ${isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-foreground'}
                      `}
                                        >
                                            {renderOption ? renderOption(item) : getOptionLabel(item)}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
