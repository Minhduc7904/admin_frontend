import { useState } from 'react'
import { FileText, Edit } from 'lucide-react'
import { MarkdownRenderer, MarkdownEditorModal, Button, ViewModeToggle } from '../../../shared/components'

export const MarkdownPreview = ({ 
  rawContent, 
  processedContent, 
  metadata,
  isLoading = false,
  onSave,
  isSaving = false
}) => {
  const [viewMode, setViewMode] = useState('preview') // 'preview' | 'text'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const hasContent = rawContent || processedContent

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (content) => {
    if (onSave) {
      await onSave(content)
      setIsEditModalOpen(false)
    }
  }

  return (
    <>
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Nội dung trích xuất
        </h2>

        {hasContent && (
          <div className="flex items-center gap-3">
            {/* Edit button */}
            <Button
              onClick={handleOpenEditModal}
              variant="primary"
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Edit className="w-3.5 h-3.5" />
              Chỉnh sửa
            </Button>

            {/* View mode toggle */}
            <ViewModeToggle 
              viewMode={viewMode} 
              onChange={setViewMode} 
            />

            {/* Metadata */}
            {metadata && (
              <div className="flex items-center gap-2 text-xs text-foreground-light">
                {metadata.childMediaCount > 0 && (
                  <span>🖼️ {metadata.childMediaCount} ảnh</span>
                )}
                {metadata.replacedImagesCount !== undefined && (
                  <span>✅ {metadata.replacedImagesCount} ảnh đã thay thế</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="ml-3 text-sm text-foreground-light">Đang tải nội dung...</p>
          </div>
        ) : !hasContent ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Chưa có nội dung
            </h3>
            <p className="text-foreground-light max-w-md">
              Upload file PDF và trích xuất để xem nội dung ở đây
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            {viewMode === 'preview' ? (
              processedContent ? (
                <MarkdownRenderer
                  content={processedContent}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-foreground-light italic">
                  Không có nội dung đã xử lý
                </p>
              )
            ) : (
              rawContent ? (
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {rawContent}
                </pre>
              ) : (
                <p className="text-sm text-foreground-light italic">
                  Không có nội dung thô
                </p>
              )
            )}
          </div>
        )}
      </div>

      {/* Footer metadata */}
      {metadata && hasContent && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 text-xs text-foreground-light">
          {metadata.childMediaIds && metadata.childMediaIds.length > 0 && (
            <span>📎 {metadata.childMediaIds.length} media con</span>
          )}
        </div>
      )}
    </div>

      {/* Edit Modal */}
      <MarkdownEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialValue={processedContent || ''}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />
    </>
  )
}
