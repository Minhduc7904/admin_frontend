import React, { useState } from 'react';
import {
    MaterialsHeader,
    MaterialsFolderTree,
    MaterialsFileList,
    type FolderNode,
    type MaterialFile,
} from '@/features/education/components/materials';

export const MaterialsPage: React.FC = () => {
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>('exam-1');

    // Mock data - folders
    const folders: FolderNode[] = [
        {
            id: 'exams-root',
            name: 'Đề thi',
            type: 'exam',
            children: [
                {
                    id: 'exam-1',
                    name: 'Học kỳ 1 - 2024',
                    type: 'exam',
                    fileCount: 12,
                    children: [
                        {
                            id: 'exam-1-1',
                            name: 'Lớp 10',
                            type: 'exam',
                            fileCount: 4,
                        },
                        {
                            id: 'exam-1-2',
                            name: 'Lớp 11',
                            type: 'exam',
                            fileCount: 5,
                        },
                        {
                            id: 'exam-1-3',
                            name: 'Lớp 12',
                            type: 'exam',
                            fileCount: 3,
                        },
                    ],
                },
                {
                    id: 'exam-2',
                    name: 'Học kỳ 2 - 2024',
                    type: 'exam',
                    fileCount: 8,
                    children: [
                        {
                            id: 'exam-2-1',
                            name: 'Lớp 10',
                            type: 'exam',
                            fileCount: 3,
                        },
                        {
                            id: 'exam-2-2',
                            name: 'Lớp 11',
                            type: 'exam',
                            fileCount: 3,
                        },
                        {
                            id: 'exam-2-3',
                            name: 'Lớp 12',
                            type: 'exam',
                            fileCount: 2,
                        },
                    ],
                },
            ],
        },
        {
            id: 'docs-root',
            name: 'Tài liệu',
            type: 'document',
            children: [
                {
                    id: 'doc-1',
                    name: 'Giáo trình',
                    type: 'document',
                    fileCount: 15,
                    children: [
                        {
                            id: 'doc-1-1',
                            name: 'Toán học',
                            type: 'document',
                            fileCount: 8,
                        },
                        {
                            id: 'doc-1-2',
                            name: 'Vật lý',
                            type: 'document',
                            fileCount: 7,
                        },
                    ],
                },
                {
                    id: 'doc-2',
                    name: 'Bài giảng',
                    type: 'document',
                    fileCount: 24,
                    children: [
                        {
                            id: 'doc-2-1',
                            name: 'Lớp 10',
                            type: 'document',
                            fileCount: 10,
                        },
                        {
                            id: 'doc-2-2',
                            name: 'Lớp 11',
                            type: 'document',
                            fileCount: 8,
                        },
                        {
                            id: 'doc-2-3',
                            name: 'Lớp 12',
                            type: 'document',
                            fileCount: 6,
                        },
                    ],
                },
                {
                    id: 'doc-3',
                    name: 'Tài liệu tham khảo',
                    type: 'document',
                    fileCount: 18,
                },
            ],
        },
    ];

    // Mock data - files
    const allFiles: MaterialFile[] = [
        {
            id: '1',
            name: 'Đề thi giữa kỳ 1 - Toán 10.pdf',
            type: 'pdf',
            size: '2.4 MB',
            uploadedAt: '2024-01-15',
            uploadedBy: 'Nguyễn Văn A',
            folderId: 'exam-1',
        },
        {
            id: '2',
            name: 'Đề thi cuối kỳ 1 - Toán 10.pdf',
            type: 'pdf',
            size: '3.1 MB',
            uploadedAt: '2024-01-20',
            uploadedBy: 'Trần Thị B',
            folderId: 'exam-1',
        },
        {
            id: '3',
            name: 'Đáp án đề thi giữa kỳ 1.doc',
            type: 'doc',
            size: '1.2 MB',
            uploadedAt: '2024-01-15',
            uploadedBy: 'Nguyễn Văn A',
            folderId: 'exam-1',
        },
        {
            id: '4',
            name: 'Biểu điểm chi tiết.xlsx',
            type: 'other',
            size: '856 KB',
            uploadedAt: '2024-01-22',
            uploadedBy: 'Lê Văn C',
            folderId: 'exam-1',
        },
        {
            id: '5',
            name: 'Hình ảnh đề thi.jpg',
            type: 'image',
            size: '1.8 MB',
            uploadedAt: '2024-01-18',
            uploadedBy: 'Phạm Thị D',
            folderId: 'exam-1',
        },
        {
            id: '6',
            name: 'Video hướng dẫn giải đề.mp4',
            type: 'video',
            size: '45.2 MB',
            uploadedAt: '2024-01-25',
            uploadedBy: 'Nguyễn Văn A',
            folderId: 'exam-1',
        },
        {
            id: '7',
            name: 'Đề thi thử THPT Quốc gia 2024.pdf',
            type: 'pdf',
            size: '4.5 MB',
            uploadedAt: '2024-02-10',
            uploadedBy: 'Hoàng Văn E',
            folderId: 'exam-1',
        },
        {
            id: '8',
            name: 'Đề thi Olympic Toán học.pdf',
            type: 'pdf',
            size: '3.8 MB',
            uploadedAt: '2024-02-15',
            uploadedBy: 'Trần Thị B',
            folderId: 'exam-1',
        },
        // Files for exam-1-1 (Lớp 10)
        {
            id: '9',
            name: 'Đề thi Toán 10 - Chương 1.pdf',
            type: 'pdf',
            size: '2.1 MB',
            uploadedAt: '2024-01-10',
            uploadedBy: 'Nguyễn Văn A',
            folderId: 'exam-1-1',
        },
        {
            id: '10',
            name: 'Đề thi Toán 10 - Chương 2.pdf',
            type: 'pdf',
            size: '2.3 MB',
            uploadedAt: '2024-01-12',
            uploadedBy: 'Nguyễn Văn A',
            folderId: 'exam-1-1',
        },
        // Files for doc-1-1 (Toán học)
        {
            id: '11',
            name: 'Giáo trình Đại số.pdf',
            type: 'pdf',
            size: '15.6 MB',
            uploadedAt: '2024-01-05',
            uploadedBy: 'Lê Văn C',
            folderId: 'doc-1-1',
        },
        {
            id: '12',
            name: 'Giáo trình Hình học.pdf',
            type: 'pdf',
            size: '12.3 MB',
            uploadedAt: '2024-01-05',
            uploadedBy: 'Lê Văn C',
            folderId: 'doc-1-1',
        },
    ];

    const currentFiles = selectedFolderId
        ? allFiles.filter((file) => file.folderId === selectedFolderId)
        : [];

    const currentFolder = selectedFolderId
        ? findFolder(folders, selectedFolderId)
        : null;

    const handleView = (fileId: string) => {
        console.log('View file:', fileId);
    };

    const handleDownload = (fileId: string) => {
        console.log('Download file:', fileId);
    };

    const handleDelete = (fileId: string) => {
        console.log('Delete file:', fileId);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <MaterialsHeader currentFolderName={currentFolder?.name} />
            
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Folder Tree */}
                <div className="w-80 bg-white">
                    <MaterialsFolderTree
                        folders={folders}
                        selectedFolderId={selectedFolderId}
                        onSelectFolder={setSelectedFolderId}
                    />
                </div>

                {/* Main Content - File List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <MaterialsFileList
                            files={currentFiles}
                            onView={handleView}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to find folder by ID
function findFolder(folders: FolderNode[], folderId: string): FolderNode | null {
    for (const folder of folders) {
        if (folder.id === folderId) return folder;
        if (folder.children) {
            const found = findFolder(folder.children, folderId);
            if (found) return found;
        }
    }
    return null;
}
