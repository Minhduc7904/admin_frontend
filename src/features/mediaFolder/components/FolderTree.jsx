import { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FolderOpen,
    Plus,
    Edit,
    Trash2,
    Loader2
} from 'lucide-react';
import { mediaFolderApi } from '../../../core/api';

const TreePrefix = ({ level, isLast }) => {
    if (level === 0) return null;

    return (
        <div className="flex items-center mr-1">
            {/* Vertical line */}
            <div className="relative w-4 flex justify-center">
                <span
                    className={`absolute top-0 bottom-0 w-px bg-border ${isLast ? 'hidden' : 'block'
                        }`}
                />
            </div>

            {/* Horizontal line */}
            <div className="w-3 flex items-center">
                <span className="w-3 h-px bg-border" />
            </div>
        </div>
    );
};


export const FolderTree = ({
    folders,
    selectedFolderId,
    onFolderSelect,
    onFolderCreate,
    onFolderEdit,
    onFolderDelete,
    expandedNodes,
    childrenMap,
    setChildrenMap,
    loading,
    level = 0,
}) => {
    const [loadingChildren, setLoadingChildren] = useState({});

    const indent = level * 20;

    const handleToggle = async (folder, e) => {
        e.stopPropagation();
        const folderId = folder.folderId;

        if (expandedNodes.has(folderId)) {
            onFolderSelect(folderId, true); // collapse
            return;
        }

        if (!childrenMap[folderId]) {
            setLoadingChildren(prev => ({ ...prev, [folderId]: true }));
            try {
                const res = await mediaFolderApi.getChildren(folderId);
                const children = res?.data?.data?.data || res?.data?.data || [];
                setChildrenMap(prev => ({ ...prev, [folderId]: children }));
            } catch {
                setChildrenMap(prev => ({ ...prev, [folderId]: [] }));
            } finally {
                setLoadingChildren(prev => ({ ...prev, [folderId]: false }));
            }
        }

        onFolderSelect(folderId, true); // expand
    };

    if (loading && level === 0) {
        return (
            <div className="flex items-center justify-center py-8 text-sm text-foreground-light">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Đang tải thư mục...
            </div>
        );
    }

    if (!folders || folders.length === 0) {
        return level === 0 ? (
            <div className="text-center py-4 text-sm text-foreground-light">
                <Folder className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                Chưa có thư mục
            </div>
        ) : null;
    }

    return (
        <div className="space-y-0.5">
            {folders.map(folder => {
                const isExpanded = expandedNodes.has(folder.folderId);
                const isSelected = selectedFolderId === folder.folderId;
                const isLoading = loadingChildren[folder.folderId];
                const Icon = isExpanded ? FolderOpen : Folder;

                return (
                    <div key={folder.folderId}>
                        {/* Row */}
                        <div
                            className={`
                                group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer
                                transition-colors text-sm
                                ${isSelected
                                    ? 'bg-info/10 text-info font-medium'
                                    : 'hover:bg-gray-50 text-foreground'
                                }
                            `}
                            style={{ paddingLeft: indent + 8 }}
                            onClick={() => onFolderSelect(folder.folderId, false)}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.dataTransfer.dropEffect = 'move';
                                e.currentTarget.classList.add('bg-info/20', 'border-2', 'border-dashed', 'border-info');
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('bg-info/20', 'border-2', 'border-dashed', 'border-info');
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('bg-info/20', 'border-2', 'border-dashed', 'border-info');

                                const mediaId = e.dataTransfer.getData('mediaId');
                                const mediaName = e.dataTransfer.getData('mediaName');
                                const currentFolderId = e.dataTransfer.getData('currentFolderId');

                                if (mediaId && folder.onDropMedia) {
                                    folder.onDropMedia({
                                        mediaId: parseInt(mediaId),
                                        mediaName,
                                        currentFolderId: currentFolderId === 'null' ? null : parseInt(currentFolderId),
                                        targetFolderId: folder.folderId,
                                        targetFolderName: folder.name
                                    });
                                }
                            }}
                        >
                            {/* Toggle */}
                            <button
                                onClick={(e) => handleToggle(folder, e)}
                                className="p-0.5 hover:bg-gray-200 rounded"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : isExpanded ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>

                            {/* Icon */}
                            <Icon size={16} className={isSelected ? 'text-info' : 'text-gray-500'} />

                            {/* Name */}
                            <span className="flex-1 truncate">{folder.name}</span>

                            {/* Media Count */}
                            {folder.mediaCount !== undefined && (
                                <span className="text-xs text-foreground-light">
                                    {folder.mediaCount}
                                </span>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFolderCreate(folder);
                                    }}
                                    className="p-1 hover:bg-green-100 rounded text-green-600"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFolderEdit(folder);
                                    }}
                                    className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFolderDelete(folder);
                                    }}
                                    className="p-1 hover:bg-red-100 rounded text-red-600"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Children */}
                        {isExpanded && childrenMap[folder.folderId] && (
                            <FolderTree
                                folders={childrenMap[folder.folderId]}
                                selectedFolderId={selectedFolderId}
                                onFolderSelect={onFolderSelect}
                                onFolderCreate={onFolderCreate}
                                onFolderEdit={onFolderEdit}
                                onFolderDelete={onFolderDelete}
                                expandedNodes={expandedNodes}
                                childrenMap={childrenMap}
                                setChildrenMap={setChildrenMap}
                                loading={false}
                                level={level + 1}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
