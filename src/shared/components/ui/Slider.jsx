export const Slider = ({
    label,
    value,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    suffix = '%',
    disabled = false,
    className = '',
}) => {
    return (
        <div className={className}>
            {/* Label */}
            {label && (
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">
                        {label}
                    </label>
                    <span className="text-sm text-foreground-light">
                        {value}{suffix}
                    </span>
                </div>
            )}

            {/* Track */}
            <div
                className={`
                    relative h-2 rounded-full
                    ${disabled ? 'bg-gray-200' : 'bg-border'}
                `}
            >
                {/* Filled */}
                <div
                    className="absolute h-2 rounded-full bg-foreground"
                    style={{
                        width: `${((value - min) / (max - min)) * 100}%`,
                    }}
                />

                {/* Thumb */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="
                        absolute inset-0 w-full h-2
                        appearance-none bg-transparent
                        cursor-pointer
                        focus:outline-none
                    "
                />
            </div>
        </div>
    );
};
