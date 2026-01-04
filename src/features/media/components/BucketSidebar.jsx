import React from 'react';
import { useSelector } from 'react-redux';
import { FolderOpen } from 'lucide-react';
import { selectBuckets, selectMediaLoadingBuckets } from '../store/mediaSlice';


export const BucketSidebar = ({
    selectedBucket,
    onBucketChange: handleBucketChange,
    loadingAdminDone,
}) => {
    const buckets = useSelector(selectBuckets);
    const loadingBuckets = useSelector(selectMediaLoadingBuckets);

    return (
        <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-border rounded-sm overflow-hidden sticky top-4">
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <FolderOpen size={18} className="text-foreground-light" />
                        <h3 className="font-semibold text-foreground">Buckets</h3>
                    </div>
                </div>
                <nav className="p-2">
                    <button
                        onClick={() => handleBucketChange('')}
                        className={`w-full text-left px-4 py-3 rounded-sm transition-colors ${selectedBucket === ''
                            ? 'bg-gray-100 text-foreground font-medium'
                            : 'text-foreground-light hover:bg-gray-50 hover:text-foreground'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Tất cả buckets</span>
                        </div>
                    </button>
                    {(loadingBuckets || !loadingAdminDone) ? (
                        <div className="p-4 text-center text-sm text-foreground-light">
                            Đang tải...
                        </div>
                    ) : (
                        buckets.length > 0 && buckets.map((bucket) => (
                            <button
                                key={bucket.name}
                                onClick={() => handleBucketChange(bucket.name)}
                                className={`w-full text-left px-4 py-3 rounded-sm transition-colors ${selectedBucket === bucket.name
                                    ? 'bg-gray-100 text-foreground font-medium'
                                    : 'text-foreground-light hover:bg-gray-50 hover:text-foreground'
                                    }`}
                            >
                                <div className="text-sm">{bucket.label}</div>
                                <div className="text-xs text-foreground-light mt-0.5">
                                    {bucket.description}
                                </div>
                            </button>
                        ))
                    )}
                </nav>
            </div>
        </div>
    )
}