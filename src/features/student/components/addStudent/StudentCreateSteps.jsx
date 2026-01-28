const STEPS = [
    { id: 1, label: 'Thông tin học sinh' },
    { id: 2, label: 'Gán khóa học & lớp' },
];

export const StudentCreateSteps = ({ currentStep }) => {
    return (
        <div className="px-6 pt-4 pb-2 border-b border-border bg-white">
            <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isDone = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex-1 flex items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                        ${isDone
                                            ? 'bg-green-500 text-white'
                                            : isActive
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-200 text-gray-500'
                                        }
                                    `}
                                >
                                    {step.id}
                                </div>

                                <span
                                    className={`text-sm font-medium ${isActive
                                            ? 'text-foreground'
                                            : 'text-foreground-light'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {index < STEPS.length - 1 && (
                                <div className="flex-1 h-px bg-border mx-4" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
