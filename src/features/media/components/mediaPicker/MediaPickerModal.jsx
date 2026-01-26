import { useEffect, useState } from 'react'
import { X, Folder, Image as ImageIcon, Upload, Check } from 'lucide-react'

import { Button } from '../../../../shared/components/ui/Button'
import { Tabs } from '../../../../shared/components/ui/Tabs'
import { Spinner, InlineLoading } from '../../../../shared/components/loading'

import { SimpleFolderTree } from './SimpleFolderTree'
import { MediaGridItem } from './MediaGridItem'

import { useMediaFolders } from '../../hooks/useMediaFolders'
import { useMediaLibrary } from '../../hooks/useMediaLibrary'
import { useMediaUpload } from '../../hooks/useMediaUpload'
import { useMediaSelection } from '../../hooks/useMediaSelection'
import { UploadTab } from './UploadTab'
/* =====================
   MediaPickerModal
===================== */
export const MediaPickerModal = ({
    isOpen,
    onClose,
    onSave,
    selectedMediaId = null,
    title = 'Chọn Media',
    type,
}) => {
    /* -----------------
       Tabs
    ----------------- */
    const [activeTab, setActiveTab] = useState('library')

    /* -----------------
       Hooks
    ----------------- */
    const folders = useMediaFolders(type)

    const library = useMediaLibrary({
        isOpen,
        activeTab,
        folderId: folders.selectedFolderId,
        type,
    })

    const selection = useMediaSelection(selectedMediaId)

    const upload = useMediaUpload({
        type,
        folderId: folders.selectedFolderId,
        onUploaded: (media) => {
            selection.setSelectedMediaId(media.mediaId)
            library.reload()
        },
    })

    /* -----------------
       Lifecycle
    ----------------- */
    useEffect(() => {
        if (!isOpen) return

        setActiveTab('library')
        folders.resetFolders()
        folders.loadRootFolders()
    }, [isOpen])

    if (!isOpen) return null

    /* -----------------
       Render
    ----------------- */
    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ===== Header ===== */}
                <div className="flex items-center justify-between p-4 border-b border-border mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ===== Tabs ===== */}
                <div className="px-4">
                    <Tabs
                        tabs={[
                            {
                                label: 'Thư viện',
                                isActive: activeTab === 'library',
                                onActivate: () => setActiveTab('library'),
                                className: 'bg-primary'
                            },
                            {
                                label: 'Tải lên',
                                isActive: activeTab === 'upload',
                                onActivate: () => setActiveTab('upload'),
                                className: 'bg-primary'
                            },
                        ]}
                    />
                </div>

                {/* ===== Content ===== */}
                <div className="flex-1 overflow-hidden flex">
                    {activeTab === 'library' ? (
                        <>
                            {/* Sidebar */}
                            <div className="w-64 border-r border-border overflow-y-auto p-3">
                                <button
                                    onClick={() => folders.setSelectedFolderId(null)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm
                    ${folders.selectedFolderId === null
                                            ? 'bg-info/10 text-info font-medium'
                                            : 'hover:bg-gray-50 text-foreground'
                                        }
                  `}
                                >
                                    <Folder size={16} />
                                    Tất cả Media
                                </button>

                                {folders.loadingFolders ? (
                                    <div className="flex justify-center py-4">
                                        <Spinner size="md" />
                                    </div>
                                ) : (
                                    <SimpleFolderTree
                                        folders={folders.rootFolders}
                                        selectedFolderId={folders.selectedFolderId}
                                        expandedNodes={folders.expandedNodes}
                                        childrenMap={folders.childrenMap}
                                        setChildrenMap={folders.setChildrenMap}
                                        mediaType={type}
                                        onFolderSelect={folders.handleFolderSelect}
                                    />
                                )}
                            </div>

                            {/* Media Grid */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {library.loadingMedia ? (
                                    <div className="flex justify-center py-12">
                                        <InlineLoading message="Đang tải media..." />
                                    </div>
                                ) : library.media.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-foreground-light">
                                        <ImageIcon className="w-16 h-16 mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">Không có media nào</p>
                                        <p className="text-sm mt-1">
                                            {folders.selectedFolderId
                                                ? 'Thư mục này chưa có media'
                                                : 'Chọn thư mục hoặc tải lên media mới'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-4">
                                        {library.media.map((item) => (
                                            <MediaGridItem
                                                key={item.mediaId}
                                                media={item}
                                                viewUrl={library.viewUrlsMap[item.mediaId]}
                                                isSelected={selection.selectedMediaId === item.mediaId}
                                                onClick={() =>
                                                    selection.setSelectedMediaId(item.mediaId)
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* ===== Upload Tab ===== */
                        <UploadTab
                            state={upload.state}
                            handlers={upload.handlers}
                            meta={upload.acceptedTypes}
                        />
                    )}
                </div>

                {/* ===== Footer ===== */}
                <div className="flex items-center justify-between p-4 border-t border-border bg-gray-50">
                    <div className="text-sm text-foreground-light">
                        {selection.selectedMediaId ? (
                            <span className="flex items-center gap-2">
                                <Check size={16} className="text-success" />
                                Đã chọn 1 media
                            </span>
                        ) : (
                            'Chưa chọn media nào'
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            disabled={!selection.selectedMediaId}
                            onClick={() => onSave(selection.selectedMediaId)}
                        >
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
