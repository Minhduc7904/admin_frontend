import { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Edit,
    Trash2,
    Plus,
} from 'lucide-react';
import { chapterApi } from '../../../core/api';
import {
    InlineLoading,
    Spinner,
    EmptyState,
    EmptyInline,
    SkeletonTable,
} from '../../../shared/components';

export const ChapterList = ({
    chapters,
    onEdit,
    onDelete,
    onCreate,
    onLoadChildren,
    expandedNodes,
    childrenMap: externalChildrenMap,
    setChildrenMap: externalSetChildrenMap,
    loading,
    level = 0,
}) => {
    // Internal state (for recursive levels)
    const [internalChildrenMap, setInternalChildrenMap] = useState({});
    const [loadingChildren, setLoadingChildren] = useState({});

    const childrenMap =
        level === 0 && externalChildrenMap
            ? externalChildrenMap
            : internalChildrenMap;

    const setChildrenMap =
        level === 0 && externalSetChildrenMap
            ? externalSetChildrenMap
            : setInternalChildrenMap;

    /* ===================== Helpers ===================== */
    const getIndentation = () => level * 24;

    const handleToggle = async (chapter) => {
        const chapterId = chapter.chapterId;

        // Collapse
        if (expandedNodes.has(chapterId)) {
            onLoadChildren(chapterId);
            return;
        }

        // Load children if not loaded
        if (!childrenMap[chapterId]) {
            setLoadingChildren((prev) => ({
                ...prev,
                [chapterId]: true,
            }));

            try {
                const response = await chapterApi.getByParentId(chapterId);
                const children =
                    response?.data?.data ||
                    response?.data ||
                    [];

                setChildrenMap((prev) => ({
                    ...prev,
                    [chapterId]: children,
                }));
            } catch (err) {
                console.error('Error loading children:', err);
                setChildrenMap((prev) => ({
                    ...prev,
                    [chapterId]: [],
                }));
            } finally {
                setLoadingChildren((prev) => ({
                    ...prev,
                    [chapterId]: false,
                }));
            }
        }

        onLoadChildren(chapterId);
    };

    /* ===================== ROOT STATES ===================== */
    if (loading && level === 0) {
        return (
            <SkeletonTable rows={5} columns={3} />
        );
    }

    if ((!chapters || chapters.length === 0) && level === 0) {
        return (
            <EmptyState
                icon="book"
                title="Chưa có chương học nào"
                description="Hãy tạo chương học đầu tiên để xây dựng nội dung môn học."
                size="md"
            />
        );
    }

    /* ===================== RENDER ===================== */
    return (
        <div className="space-y-1">
            {chapters.map((chapter) => {
                const chapterId = chapter.chapterId;
                const isExpanded = expandedNodes.has(chapterId);
                const isLoadingChildren = loadingChildren[chapterId];
                const children = childrenMap[chapterId];

                return (
                    <div key={chapterId}>
                        {/* ===== Chapter Row ===== */}
                        <div
                            className="flex items-center py-2 px-3 rounded hover:bg-gray-50 group border-b border-border cursor-pointer"
                            style={{
                                paddingLeft: `${getIndentation() + 12}px`,
                            }}
                            onClick={() => handleToggle(chapter)}
                        >
                            {/* Toggle */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle(chapter);
                                }}
                                className="mr-2 p-1 hover:bg-gray-200 rounded"
                                disabled={isLoadingChildren}
                            >
                                {isLoadingChildren ? (
                                    <Spinner size="sm" />
                                ) : isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                )}
                            </button>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground truncate">
                                        {chapter.name}
                                    </span>

                                    {chapter.subjectName && (
                                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                                            {chapter.subjectName}
                                        </span>
                                    )}

                                    {chapter.code && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                            {chapter.code}
                                        </span>
                                    )}

                                    <span className="text-xs text-gray-400">
                                        Level {chapter.level ?? 1}
                                    </span>
                                </div>

                                {chapter.slug && (
                                    <div className="text-xs text-foreground-light truncate mt-0.5">
                                        /{chapter.slug}
                                    </div>
                                )}
                            </div>

                            {/* Order */}
                            <div className="text-sm text-gray-500 mx-4 whitespace-nowrap">
                                Thứ tự: {chapter.orderInParent || 0}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCreate(chapter);
                                    }}
                                    className="p-1.5 hover:bg-green-100 rounded text-green-600"
                                    title="Thêm chương con"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(chapter);
                                    }}
                                    className="p-1.5 hover:bg-blue-100 rounded text-blue-600"
                                    title="Chỉnh sửa"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(chapter);
                                    }}
                                    className="p-1.5 hover:bg-red-100 rounded text-red-600"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* ===== Children ===== */}
                        {isExpanded && (
                            <>
                                {isLoadingChildren && (
                                    <div
                                        className="py-2"
                                        style={{
                                            paddingLeft: `${getIndentation() + 48}px`,
                                        }}
                                    >
                                        <InlineLoading message="Đang tải chương con..." />
                                    </div>
                                )}

                                {children && children.length === 0 && !isLoadingChildren && (
                                    <div
                                        style={{
                                            paddingLeft: `${getIndentation() + 48}px`,
                                        }}
                                    >
                                        <EmptyInline message="Không có chương con" icon="book" />
                                    </div>
                                )}

                                {children && children.length > 0 && (
                                    <ChapterList
                                        chapters={children}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onCreate={onCreate}
                                        onLoadChildren={onLoadChildren}
                                        expandedNodes={expandedNodes}
                                        childrenMap={childrenMap}
                                        setChildrenMap={setChildrenMap}
                                        loading={false}
                                        level={level + 1}
                                    />
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
