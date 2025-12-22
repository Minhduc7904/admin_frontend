import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

export interface FolderNode {
    id: string;
    name: string;
    type: 'exam' | 'document';
    children?: FolderNode[];
    fileCount?: number;
}

interface MaterialsFolderTreeProps {
    folders: FolderNode[];
    selectedFolderId: string | null;
    onSelectFolder: (folderId: string) => void;
}

interface FolderItemProps {
    folder: FolderNode;
    level: number;
    isSelected: boolean;
    onSelect: (folderId: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, level, isSelected, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = folder.children && folder.children.length > 0;

    return (
        <div>
            <div
                className={`
                    flex items-center gap-2 px-3 py-2 cursor-pointer
                    hover:bg-gray-50 transition-colors
                    ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                `}
                style={{ paddingLeft: `${level * 16 + 12}px` }}
                onClick={() => onSelect(folder.id)}
            >
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                )}
                {!hasChildren && <div className="w-5" />}
                
                {isExpanded || !hasChildren ? (
                    <FolderOpen className="w-5 h-5 text-yellow-500" />
                ) : (
                    <Folder className="w-5 h-5 text-yellow-500" />
                )}
                
                <span className="flex-1 text-sm font-medium">{folder.name}</span>
                
                {folder.fileCount !== undefined && (
                    <span className="text-xs text-gray-500">
                        {folder.fileCount}
                    </span>
                )}
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {folder.children!.map((child) => (
                        <FolderItem
                            key={child.id}
                            folder={child}
                            level={level + 1}
                            isSelected={isSelected}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const MaterialsFolderTree: React.FC<MaterialsFolderTreeProps> = ({
    folders,
    selectedFolderId,
    onSelectFolder,
}) => {
    return (
        <div className="border-r border-gray-200 h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Thư mục</h2>
            </div>
            
            <div className="py-2">
                {folders.map((folder) => (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        level={0}
                        isSelected={selectedFolderId === folder.id}
                        onSelect={onSelectFolder}
                    />
                ))}
            </div>
        </div>
    );
};
