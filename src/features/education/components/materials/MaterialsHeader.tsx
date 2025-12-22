import React from 'react';
import { Upload, FolderPlus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MaterialsHeaderProps {
    currentFolderName?: string;
}

export const MaterialsHeader: React.FC<MaterialsHeaderProps> = ({ currentFolderName }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/education/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Tài liệu</h1>
                        {currentFolderName && (
                            <p className="text-sm text-gray-500 mt-1">
                                Thư mục: {currentFolderName}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <FolderPlus className="w-4 h-4" />
                        Thêm thư mục
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload className="w-4 h-4" />
                        Tải lên
                    </button>
                </div>
            </div>
        </div>
    );
};
