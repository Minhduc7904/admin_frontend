import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Tìm kiếm...', 
  debounce = 300,
  disabled = false 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    // Skip debounce on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [localValue, debounce]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-2.5 text-foreground-lighter" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-9 pr-9 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-2.5 text-foreground-lighter hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
