import { useState } from 'react'
import { FileText, Eye, Code, Sparkles, ArrowUpFromLine } from 'lucide-react'
import { MarkdownRenderer } from '../../../shared/components'
import { Button } from '../../../shared/components'

export const ExtractedTextPreview = ({ 
  rawContent, 
  processedContent, 
  metadata,
  mediaId,
  sessionId,
  onExtract,
  onMerge,
  isExtracting = false,
  isLoadingContent = false,
  isMerging = false
}) => {
  const [viewMode, setViewMode] = useState('preview') // 'preview' | 'text'

  // Show extract button if no content and mediaId exists
  const hasContent = rawContent
  const canExtract = mediaId && onExtract
  const canMerge = sessionId && onMerge && hasContent

  const handleMerge = () => {
    if (canMerge && rawContent) {
      onMerge(sessionId, rawContent)
    }
  }

  return (
    <div className="border-t border-border pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground-light flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Nội dung đã trích xuất
        </label>

        <div className="flex items-center gap-3">
          {/* Extract button in header */}
          {canExtract && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExtract(mediaId)}
              disabled={isExtracting}
              className="flex items-center gap-1 text-xs"
            >
              {isExtracting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-purple-600 border-t-transparent" />
                  {isLoadingContent ? 'Đang tải...' : 'Đang trích xuất...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  Trích xuất AI
                </>
              )}
            </Button>
          )}

          {/* Merge button */}
          {canMerge && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleMerge}
              disabled={isMerging}
              className="flex items-center gap-1 text-xs"
            >
              {isMerging ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                  Đang merge...
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="w-3 h-3" />
                  Merge vào Session
                </>
              )}
            </Button>
          )}

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded p-0.5">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-foreground-light hover:text-foreground'
              }`}
              title="Xem dạng markdown"
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>

            <button
              onClick={() => setViewMode('text')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                viewMode === 'text'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-foreground-light hover:text-foreground'
              }`}
              title="Xem dạng text thô"
            >
              <Code className="w-3 h-3" />
              Text
            </button>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-foreground-light">
            {metadata?.childMediaCount > 0 && (
              <span>🖼️ {metadata.childMediaCount} ảnh</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200 max-h-96 overflow-y-auto">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-16 h-16 text-purple-400 mb-4" />
            <p className="text-sm text-foreground-light mb-4">
              Chưa có nội dung trích xuất. Nhấn nút bên dưới để trích xuất bằng AI.
            </p>
            {canExtract && (
              <Button
                variant="primary"
                onClick={() => onExtract(mediaId)}
                disabled={isExtracting}
                className="flex items-center gap-2"
              >
                {isExtracting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    {isLoadingContent ? 'Đang tải nội dung...' : 'Đang trích xuất từ AI...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Trích xuất văn bản từ AI
                  </>
                )}
              </Button>
            )}
          </div>
        ) : viewMode === 'preview' ? (
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

      {/* Footer metadata */}
      {metadata && (
        <div className="mt-2 flex items-center gap-3 text-xs text-foreground-light">
          {metadata.presignedExpirySeconds && (
            <span>⏱️ URL hết hạn sau: {metadata.presignedExpirySeconds}s</span>
          )}
          {metadata.childMediaIds && metadata.childMediaIds.length > 0 && (
            <span>📎 {metadata.childMediaIds.length} media con</span>
          )}
        </div>
      )}
    </div>
  )
}
