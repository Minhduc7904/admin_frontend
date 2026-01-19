import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FolderOpen, HardDrive, FileText } from 'lucide-react';
import { 
    selectBuckets, 
    selectMediaLoadingBuckets,
    getBucketStatisticsAsync,
    selectBucketStatistics,
    selectBucketStatisticsLoading
} from '../store/mediaSlice';


export const BucketSidebar = ({
    selectedBucket,
    onBucketChange: handleBucketChange,
    loadingAdminDone,
}) => {
    const dispatch = useDispatch();
    const buckets = useSelector(selectBuckets);
    const loadingBuckets = useSelector(selectMediaLoadingBuckets);
    const bucketStatistics = useSelector(selectBucketStatistics);
    const loadingStatistics = useSelector(selectBucketStatisticsLoading);

    // Load bucket statistics when component mounts
    useEffect(() => {
        if (loadingAdminDone) {
            dispatch(getBucketStatisticsAsync());
        }
    }, [dispatch, loadingAdminDone]);

    // Format bytes to human readable format
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    // Get statistics for a specific bucket
    const getBucketStats = (bucketName) => {
        if (!bucketStatistics?.buckets) return null;
        return bucketStatistics.buckets.find(b => b.bucketName === bucketName);
    };

    return (
        <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-border rounded-sm overflow-hidden sticky top-4">
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <FolderOpen size={18} className="text-foreground-light" />
                        <h3 className="font-semibold text-foreground">Buckets</h3>
                    </div>
                    {/* Overall Statistics */}
                    {bucketStatistics && !loadingStatistics && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                                <FileText size={14} className="text-blue-500" />
                                <span className="text-foreground-light">Tổng files:</span>
                                <span className="font-semibold text-foreground ml-auto">
                                    {bucketStatistics.totalFiles.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <HardDrive size={14} className="text-purple-500" />
                                <span className="text-foreground-light">Dung lượng:</span>
                                <span className="font-semibold text-foreground ml-auto">
                                    {formatBytes(bucketStatistics.totalSize)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <nav className="p-2">
                    <button
                        onClick={() => handleBucketChange('')}
                        className={`w-full text-left px-4 py-3 rounded-sm transition-colors ${selectedBucket === ''
                            ? 'bg-gray-100 text-foreground font-medium'
                            : 'text-foreground-light hover:bg-gray-100 hover:text-foreground'
                            }`}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">Tất cả buckets</span>
                            {bucketStatistics && !loadingStatistics && (
                                <div className="flex items-center gap-3 text-xs text-foreground-light">
                                    <span>{bucketStatistics.totalFiles} files</span>
                                    <span>•</span>
                                    <span>{formatBytes(bucketStatistics.totalSize)}</span>
                                </div>
                            )}
                        </div>
                    </button>
                    {(loadingBuckets || !loadingAdminDone) ? (
                        <div className="p-4 text-center text-sm text-foreground-light">
                            Đang tải...
                        </div>
                    ) : (
                        buckets.length > 0 && buckets.map((bucket) => {
                            const stats = getBucketStats(bucket.name);
                            return (
                                <button
                                    key={bucket.name}
                                    onClick={() => handleBucketChange(bucket.name)}
                                    className={`w-full text-left px-4 py-3 rounded-sm transition-colors ${selectedBucket === bucket.name
                                        ? 'bg-gray-100 text-foreground font-medium'
                                        : 'text-foreground-light hover:bg-gray-100 hover:text-foreground'
                                        }`}
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm font-medium">{bucket.label}</div>
                                        <div className="text-xs text-foreground-light">
                                            {bucket.description}
                                        </div>
                                        {stats && !loadingStatistics ? (
                                            <div className="flex items-center gap-3 text-xs text-foreground-light mt-1">
                                                <span className="flex items-center gap-1">
                                                    <FileText size={12} />
                                                    {stats.fileCount} files
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <HardDrive size={12} />
                                                    {formatBytes(stats.totalSize)}
                                                </span>
                                            </div>
                                        ) : loadingStatistics ? (
                                            <div className="text-xs text-foreground-light mt-1">
                                                Đang tải thống kê...
                                            </div>
                                        ) : null}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </nav>
            </div>
        </div>
    )
}