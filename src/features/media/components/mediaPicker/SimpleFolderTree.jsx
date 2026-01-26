import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { mediaFolderApi } from '../../../../core/api';
import { Loader2 } from 'lucide-react';
/* =====================
   Simple Folder Tree
===================== */
export const SimpleFolderTree = ({
    folders,
    selectedFolderId,
    onFolderSelect,
    expandedNodes,
    childrenMap,
    setChildrenMap,
    level = 0,
    mediaType = undefined
}) => {
    const [loadingChildren, setLoadingChildren] = useState({});
    const indent = level * 16;

    const handleToggle = async (folder, e) => {
        e.stopPropagation();
        const folderId = folder.folderId;

        if (expandedNodes.has(folderId)) {
            // Collapse
            const newExpanded = new Set(expandedNodes);
            newExpanded.delete(folderId);
            onFolderSelect(folderId, true, newExpanded);
            return;
        }

        // Expand - load children if not loaded
        if (!childrenMap[folderId]) {
            setLoadingChildren(prev => ({ ...prev, [folderId]: true }));
            try {
                const params = mediaType ? { type: mediaType } : {};
                const res = await mediaFolderApi.getChildren(folderId, params);
                const children = res?.data?.data?.data || res?.data?.data || [];
                setChildrenMap(prev => ({ ...prev, [folderId]: children }));
            } catch {
                setChildrenMap(prev => ({ ...prev, [folderId]: [] }));
            } finally {
                setLoadingChildren(prev => ({ ...prev, [folderId]: false }));
            }
        }

        const newExpanded = new Set(expandedNodes);
        newExpanded.add(folderId);
        onFolderSelect(folderId, true, newExpanded);
    };

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
                const children = childrenMap[folder.folderId] || [];

                return (
                    <div key={folder.folderId}>
                        {/* Folder Row */}
                        <div
                            className={`
                                flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer
                                transition-colors text-sm
                                ${isSelected
                                    ? 'bg-info/10 text-info font-medium'
                                    : 'hover:bg-gray-50 text-foreground'
                                }
                            `}
                            style={{ paddingLeft: indent + 8 }}
                            onClick={() => onFolderSelect(folder.folderId)}
                        >
                            {/* Toggle Button */}
                            <button
                                onClick={(e) => handleToggle(folder, e)}
                                className="p-0.5 hover:bg-gray-200 rounded"
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
                        </div>

                        {/* Children */}
                        {isExpanded && children.length > 0 && (
                            <SimpleFolderTree
                                folders={children}
                                selectedFolderId={selectedFolderId}
                                onFolderSelect={onFolderSelect}
                                expandedNodes={expandedNodes}
                                childrenMap={childrenMap}
                                setChildrenMap={setChildrenMap}
                                level={level + 1}
                                mediaType={mediaType}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};