import React from 'react';
import { Card } from '@/shared/components/ui';
import { Download } from 'lucide-react';

interface FileItem {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    downloads: number;
}

interface AdminFilesTabProps {
    files: FileItem[];
    onDownload?: (fileId: string) => void;
}

export const AdminFilesTab: React.FC<AdminFilesTabProps> = ({ files, onDownload }) => {
    return (
        <Card>
            <div className="space-y-2">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold">
                                {file.type}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-gray-500">{file.size}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500">{file.uploadedAt}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500">{file.downloads} lượt tải</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onDownload?.(file.id)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
};
