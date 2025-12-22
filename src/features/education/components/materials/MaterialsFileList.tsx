import React from 'react';
import {
    FileText,
    FileImage,
    FileVideo,
    File,
    Download,
    Eye,
    Trash2,
    Calendar,
    User,
} from 'lucide-react';

export interface MaterialFile {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
    size: string;
    uploadedAt: string;
    uploadedBy: string;
    folderId: string;
}

interface MaterialsFileListProps {
    files: MaterialFile[];
    onView: (fileId: string) => void;
    onDownload: (fileId: string) => void;
    onDelete: (fileId: string) => void;
}

const getFileIcon = (type: MaterialFile['type']) => {
    switch (type) {
        case 'pdf':
            return <FileText className="w-8 h-8 text-red-500" />;
        case 'doc':
            return <FileText className="w-8 h-8 text-blue-500" />;
        case 'image':
            return <FileImage className="w-8 h-8 text-purple-500" />;
        case 'video':
            return <FileVideo className="w-8 h-8 text-orange-500" />;
        default:
            return <File className="w-8 h-8 text-gray-500" />;
    }
};

const getFileTypeText = (type: MaterialFile['type']) => {
    switch (type) {
        case 'pdf':
            return 'PDF';
        case 'doc':
            return 'DOC';
        case 'image':
            return 'Hình ảnh';
        case 'video':
            return 'Video';
        default:
            return 'File';
    }
};

const getFileTypeColor = (type: MaterialFile['type']) => {
    switch (type) {
        case 'pdf':
            return 'bg-red-100 text-red-700';
        case 'doc':
            return 'bg-blue-100 text-blue-700';
        case 'image':
            return 'bg-purple-100 text-purple-700';
        case 'video':
            return 'bg-orange-100 text-orange-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export const MaterialsFileList: React.FC<MaterialsFileListProps> = ({
    files,
    onView,
    onDownload,
    onDelete,
}) => {
    if (files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <File className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Không có tài liệu nào</p>
                <p className="text-sm">Chọn một thư mục để xem tài liệu</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên tài liệu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại file
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kích thước
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày tải lên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Người tải lên
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    {getFileIcon(file.type)}
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {file.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded ${getFileTypeColor(
                                        file.type
                                    )}`}
                                >
                                    {getFileTypeText(file.type)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-700">{file.size}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {file.uploadedAt}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <User className="w-4 h-4 text-gray-400" />
                                    {file.uploadedBy}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onView(file.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Xem"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDownload(file.id)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                        title="Tải xuống"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(file.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
