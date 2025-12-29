export const Switch = ({ checked, onChange, disabled = false, loading = false }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => !disabled && !loading && onChange(!checked)}
            disabled={disabled || loading}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${checked ? 'bg-blue-600' : 'bg-gray-200'}
                ${loading ? 'cursor-wait' : 'cursor-pointer'}
            `}
        >
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${checked ? 'translate-x-6' : 'translate-x-1'}
                    ${loading ? 'animate-pulse' : ''}
                `}
            />
        </button>
    );
};
