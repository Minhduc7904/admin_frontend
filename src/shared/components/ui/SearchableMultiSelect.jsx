import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { InlineLoading } from '../loading/Loading';
import { EmptyInline } from '../empty/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

/**
 * SearchableMultiSelect
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.placeholder
 * @param {Function} props.onChange              // (items[]) => void
 * @param {Function} props.searchFunction        // (keyword, page) => Promise<{ data, meta }>
 * @param {Function} props.fetchDefaultItems     // (page) => Promise<{ data, meta }>
 * @param {Function} props.getOptionLabel
 * @param {Function} props.getOptionValue
 * @param {Function} props.renderOption
 * @param {Array} props.value                    // selected items array
 * @param {string} props.error
 * @param {boolean} props.required
 * @param {boolean} props.disabled
 * @param {number} props.debounceMs
 * @param {boolean} props.enableInfiniteScroll   // Enable infinite scroll
 */
export const SearchableMultiSelect = ({
    label,
    placeholder = 'Tìm kiếm...',
    onChange,
    searchFunction,
    fetchDefaultItems,
    getOptionLabel = (item) => item?.name || item?.title || String(item),
    getOptionValue = (item) => item?.id || item,
    renderOption,
    value = [],
    error,
    required = false,
    disabled = false,
    debounceMs = 300,
    enableInfiniteScroll = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const containerRef = useRef(null);
    const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);
    const prevSearchTermRef = useRef('');
    const isFirstOpenRef = useRef(true);

    /* ===================== OUTSIDE CLICK ===================== */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        if (!isOpen) return;

        // Check if search term changed
        const searchTermChanged = debouncedSearchTerm !== prevSearchTermRef.current;
        
        // If search term changed, reset page and options
        if (searchTermChanged) {
            setPage(1);
            setOptions([]);
            prevSearchTermRef.current = debouncedSearchTerm;
            
            if (debouncedSearchTerm) {
                search(debouncedSearchTerm, 1);
            } else {
                loadDefault(1);
            }
        } 
        // If opening for the first time or no options yet, load data
        else if (isFirstOpenRef.current || options.length === 0) {
            isFirstOpenRef.current = false;
            
            if (debouncedSearchTerm) {
                search(debouncedSearchTerm, 1);
            } else {
                loadDefault(1);
            }
        }
    }, [debouncedSearchTerm, isOpen]);

    const loadDefault = async (pageNum) => {
        if (!fetchDefaultItems) return;
        setLoading(true);
        try {
            const res = await fetchDefaultItems(pageNum);
            const newData = res?.data || res || [];
            setOptions(prev => pageNum === 1 ? newData : [...prev, ...newData]);
            setHasMore(res?.meta?.hasNext || false);
        } catch {
            setOptions([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const search = async (keyword, pageNum) => {
        if (!searchFunction) return;
        setLoading(true);
        try {
            const res = await searchFunction(keyword, pageNum);
            const newData = res?.data || res || [];
            setOptions(prev => pageNum === 1 ? newData : [...prev, ...newData]);
            setHasMore(res?.meta?.hasNext || false);
        } catch {
            setOptions([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    /* ===================== LOAD MORE ===================== */
    const loadMore = () => {
        if (!enableInfiniteScroll || loading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        if (debouncedSearchTerm) {
            search(debouncedSearchTerm, nextPage);
        } else {
            loadDefault(nextPage);
        }
    };

    const lastElementRef = useInfiniteScroll(loadMore, hasMore, loading);

    /* ===================== SELECT ===================== */
    const isSelected = (item) =>
        value.some(v => getOptionValue(v) === getOptionValue(item));

    const toggleSelect = (item) => {
        let next;
        if (isSelected(item)) {
            next = value.filter(v => getOptionValue(v) !== getOptionValue(item));
        } else {
            next = [...value, item];
        }
        onChange?.(next);
    };

    const removeItem = (item, e) => {
        e.stopPropagation();
        onChange?.(
            value.filter(v => getOptionValue(v) !== getOptionValue(item))
        );
    };

    /* ===================== RENDER ===================== */
    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Input */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    min-h-[38px] px-3 py-2 text-sm border rounded-sm cursor-pointer
                    flex flex-wrap items-center gap-2
                    ${error ? 'border-red-500' : 'border-border'}
                    ${disabled ? 'bg-gray-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-foreground'}
                `}
            >
                {value.length === 0 && (
                    <span className="text-foreground-light flex-1">
                        {placeholder}
                    </span>
                )}

                {value.map(item => (
                    <span
                        key={getOptionValue(item)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                        {getOptionLabel(item)}
                        {!disabled && (
                            <button onClick={(e) => removeItem(item, e)}>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </span>
                ))}

                <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-sm shadow-lg max-h-64 flex flex-col">
                    {/* Search */}
                    <div className="p-2 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-foreground-light" />
                            <input
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Nhập từ khóa..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1">
                        {loading && options.length === 0 ? (
                            <div className='w-full flex justify-center items-center text-center'><InlineLoading message="Đang tải..." /></div>
                        ) : options.length === 0 ? (
                            <EmptyInline icon="search" message="Không có dữ liệu" />
                        ) : (
                            <ul>
                                {options.map((item, index) => {
                                    const selected = isSelected(item);
                                    const isLast = index === options.length - 1;
                                    return (
                                        <li
                                            key={getOptionValue(item) + '-' + index}
                                            ref={enableInfiniteScroll && isLast ? lastElementRef : null}
                                            onClick={() => toggleSelect(item)}
                                            className={`
                                                px-4 py-2 text-sm cursor-pointer flex justify-between
                                                ${selected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}
                                            `}
                                        >
                                            {renderOption
                                                ? renderOption(item)
                                                : getOptionLabel(item)}
                                            {selected && <span>✓</span>}
                                        </li>
                                    );
                                })}
                                {loading && options.length > 0 && (
                                    <li className="px-4 py-2 text-center text-sm text-gray-500">
                                        <InlineLoading message="Đang tải thêm..." />
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
