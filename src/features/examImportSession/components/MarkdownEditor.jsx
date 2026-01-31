import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

/**
 * Markdown Editor - KHÔNG convert, KHÔNG escape
 * Markdown là source of truth
 * Giữ nguyên media:123 syntax
 */
export const MarkdownEditor = ({
  value = '',
  onChange,
  editable = true,
  height = 500,
  placeholder = 'Nhập nội dung markdown...',
}) => {
  if (!editable) {
    // Preview only mode
    return (
      <div data-color-mode="light">
        <MDEditor.Markdown 
          source={value} 
          style={{ padding: 16 }}
        />
      </div>
    )
  }

  // Edit mode
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="edit"
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={false}
        textareaProps={{
          placeholder,
        }}
      />
    </div>
  )
}
