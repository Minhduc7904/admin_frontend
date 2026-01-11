// 1. Imports
import React from 'react';

// 2. Component definition
export const Tabs = ({ tabs }) => {
    return (
        <div className="w-full">
            {/* Tab headers */}
            <div className="border-b border-border">
                <div className="flex gap-2">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={tab.onActivate}
                            className={`
                px-4 py-2 text-sm font-medium
                border-b-2
                transition-colors
                ${tab.className || ''}
                ${tab.isActive
                                    ? 'border-info text-info'
                                    : 'border-transparent text-foreground-light hover:text-foreground'
                                }
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
