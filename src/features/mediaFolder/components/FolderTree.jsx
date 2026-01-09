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
                    className={`absolute top-0 bottom-0 w-px bg-border ${
                        isLast ? 'hidden' : 'block'
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
            <div className="text-center py-8 text-sm text-foreground-light">
                <Folder className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                Chưa có thư mục nào
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
                                group flex items-center gap-1 px-2 py-1.5 rounded-sm cursor-pointer
                                transition-colors
                                ${isSelected
                                    ? 'bg-info/5 border-l-2 border-info'
                                    : 'hover:bg-gray-50'
                                }
                            `}
                            style={{ paddingLeft: indent + 8 }}
                            onClick={() => onFolderSelect(folder.folderId, false)}
                        >
                            {/* Toggle */}
                            <button
                                onClick={(e) => handleToggle(folder, e)}
                                className="p-1 rounded hover:bg-gray-200"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                ) : isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                            </button>

                            {/* Icon */}
                            <Icon
                                className={`w-4 h-4 ${
                                    isSelected ? 'text-info' : 'text-gray-500'
                                }`}
                            />

                            {/* Name */}
                            <div className="flex-1 min-w-0 ml-1">
                                <p className={`text-sm truncate ${
                                    isSelected ? 'font-semibold text-foreground' : ''
                                }`}>
                                    {folder.name}
                                </p>
                                {folder.description && (
                                    <p className="text-xs text-foreground-light truncate">
                                        {folder.description}
                                    </p>
                                )}
                            </div>

                            {/* Count */}
                            {folder.mediaCount > 0 && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
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
