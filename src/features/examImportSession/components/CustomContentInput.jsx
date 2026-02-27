import { useState, useRef, useCallback } from 'react'
import { Edit, AlertCircle, Eraser, KeyRound } from 'lucide-react'
import { ViewModeToggle, MarkdownRenderer } from '../../../shared/components'

// ─── stripMarkdown ────────────────────────────────────────────────────────────
// Lược bỏ các ký hiệu markdown không cần thiết:
//   - Tiêu đề (#, ##, ###…)
//   - Đường kẻ ngang (---)
const stripMarkdown = (text) => {
    return text
        .split('\n')
        .filter(line => {
            const trimmed = line.trim()
            // Bỏ đường kẻ ngang thuần (---, ***, ___)
            if (/^[-*_]{3,}$/.test(trimmed)) return false
            return true
        })
        .map(line => {
            // Bỏ ký hiệu tiêu đề (# Tiêu đề → Tiêu đề)
            line = line.replace(/^#{1,6}\s+/, '')
            // Bỏ in đậm (**text** hoặc __text__)
            line = line.replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1')
            // Bỏ in nghiêng (*text* hoặc _text_)
            line = line.replace(/\*(.+?)\*/g, '$1').replace(/_(.+?)_/g, '$1')
            return line
        })
        // Bỏ nhiều dòng trắng liên tiếp (>2) thành 1 dòng trống
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        // Giải mã HTML entities phổ biến
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trimEnd()
}

// ─── AnswerKeyBar ─────────────────────────────────────────────────────────────
// Thanh nhập đáp án hiển thị phía trên CodeTextarea
const ANSWER_CONFIG = {
    'trac-nghiem': {
        label: 'Đáp án trắc nghiệm',
        placeholder: 'VD: A B C D A A C C',
        hint: 'Các chữ cái A-D cách nhau bởi dấu cách, theo thứ tự câu hỏi',
        validate: (v) => /^[A-Da-d]+(\s+[A-Da-d]+)*\s*$/.test(v.trim()),
    },
    'dung-sai': {
        label: 'Đáp án đúng/sai',
        placeholder: 'VD: ddss dsss ddds',
        hint: 'Mỗi nhóm là 1 câu — d = đúng, s = sai, cách nhau bởi dấu cách',
        validate: (v) => /^[DSdsđĐ]+(\s+[DSdsđĐ]+)*\s*$/.test(v.trim()),
    },
    'tra-loi-ngan': {
        label: 'Đáp án trả lời ngắn',
        placeholder: 'VD: 3,14 3 4 16 hoặc 3.14 3 4 16',
        hint: 'Mỗi đáp án cách nhau bởi dấu cách; dấu thập phân dùng , hoặc . đều được',
        validate: () => true,
    },
}

const AnswerKeyBar = ({ sectionType, value = '', onChange, disabled }) => {
    const config = ANSWER_CONFIG[sectionType]
    if (!config) return null

    const isEmpty   = !value.trim()
    const isInvalid = !isEmpty && !config.validate(value)

    return (
        <div className={`rounded-lg border overflow-hidden ${
            isInvalid ? 'border-amber-300 bg-amber-50' : 'border-zinc-200 bg-zinc-50'
        }`}>
            {/* Header */}
            <div className={`flex items-center gap-2 px-3 py-1.5 border-b ${
                isInvalid ? 'border-amber-200 bg-amber-100/60' : 'border-zinc-200 bg-zinc-100/60'
            }`}>
                <KeyRound className={`w-3.5 h-3.5 shrink-0 ${
                    isInvalid ? 'text-amber-600' : 'text-zinc-500'
                }`} />
                <span className={`text-xs font-semibold ${
                    isInvalid ? 'text-amber-700' : 'text-zinc-600'
                }`}>
                    {config.label}
                </span>
                {isInvalid && (
                    <span className="ml-auto text-xs text-amber-600">
                        Định dạng chưa đúng
                    </span>
                )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2">
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder={config.placeholder}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    className={`flex-1 bg-transparent font-mono text-sm
                                focus:outline-none placeholder:text-zinc-400
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${ isInvalid ? 'text-amber-800' : 'text-foreground' }`}
                />
            </div>

            {/* Hint */}
            <p className={`px-3 pb-2 text-xs ${
                isInvalid ? 'text-amber-600' : 'text-zinc-400'
            }`}>
                {config.hint}
            </p>
        </div>
    )
}

// ─── CodeTextarea ────────────────────────────────────────────────────────────
// textarea với line-numbers gutter + highlight dòng lỗi (rowIndexes = 1-based)
const LINE_HEIGHT = 24 // px — phải khớp với leading-6 (1.5rem = 24px)
const PADDING_TOP = 8  // px — pt-2

// rowErrors = [{ line: number (1-based), message: string }]
const CodeTextarea = ({ value = '', onChange, disabled, placeholder, rowErrors = [] }) => {
    const textareaRef = useRef(null)
    const gutterRef   = useRef(null)
    const overlayRef  = useRef(null)

    const lineCount = value.split('\n').length
    const errorSet  = new Set(rowErrors.map(e => e.line))
    const errorMsg  = Object.fromEntries(rowErrors.map(e => [e.line, e.message]))

    const gutterWidth = lineCount >= 10000 ? '4.5rem'
        : lineCount >= 1000 ? '3.75rem'
        : lineCount >= 100  ? '3.25rem'
        : '2.75rem'

    const syncScroll = useCallback(() => {
        const top = textareaRef.current?.scrollTop ?? 0
        if (gutterRef.current)  gutterRef.current.scrollTop  = top
        if (overlayRef.current) overlayRef.current.scrollTop = top
    }, [])

    return (
        <div className="flex h-80 rounded-lg border border-border overflow-hidden bg-white focus-within:ring-2 focus-within:ring-zinc-300 focus-within:border-zinc-400">
            {/* Gutter */}
            <div
                ref={gutterRef}
                className="shrink-0 h-full overflow-hidden bg-zinc-50 border-r border-zinc-200 select-none"
                style={{ width: gutterWidth }}
            >
                {/* top padding matches textarea so line 1 aligns */}
                <div style={{ paddingTop: PADDING_TOP, paddingBottom: PADDING_TOP }}>
                    {Array.from({ length: lineCount }, (_, i) => {
                        const n = i + 1
                        const isErr = errorSet.has(n)
                        const msg   = errorMsg[n]
                        return (
                            <div
                                key={n}
                                title={isErr && msg ? msg : undefined}
                                style={{ height: LINE_HEIGHT, lineHeight: `${LINE_HEIGHT}px` }}
                                className={`relative flex items-center justify-end gap-1 px-2
                                    font-mono text-xs transition-colors cursor-default
                                    ${isErr ? 'bg-red-100 text-red-500 font-semibold' : 'text-zinc-400'}`}
                            >
                                {isErr && (
                                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                                )}
                                <span>{n}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Editor area ── */}
            <div className="flex-1 relative min-h-0">
                {/* Error-line highlight overlay — absolutely fills the editor,
                    scrollTop synced to textarea so highlights track correctly */}
                <div
                    ref={overlayRef}
                    aria-hidden
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                >
                    <div style={{ paddingTop: PADDING_TOP, paddingBottom: PADDING_TOP }}>
                        {Array.from({ length: lineCount }, (_, i) => {
                            const n = i + 1
                            return (
                                <div
                                    key={n}
                                    style={{ height: LINE_HEIGHT }}
                                    className={errorSet.has(n) ? 'bg-red-50' : ''}
                                />
                            )
                        })}
                    </div>
                </div>

                {/* Actual textarea — transparent bg so overlay shows through */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onScroll={syncScroll}
                    disabled={disabled}
                    placeholder={placeholder}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    className="relative w-full h-full px-3 bg-transparent
                               font-mono text-sm resize-none
                               focus:outline-none
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        paddingTop: PADDING_TOP,
                        paddingBottom: PADDING_TOP,
                        lineHeight: `${LINE_HEIGHT}px`,
                    }}
                />
            </div>
        </div>
    )
}

// ─── ErrorPanel ─────────────────────────────────────────────────────────────
// VS Code-style Problems panel
const ErrorPanel = ({ rowErrors }) => {
    if (!rowErrors.length) return null
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100/70">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-xs font-semibold text-red-700">
                    {rowErrors.length} lỗi
                </span>
            </div>
            <div className="divide-y divide-red-100 max-h-40 overflow-y-auto">
                {rowErrors.map((e, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-3 py-2">
                        <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-red-400" />
                        <div className="min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="font-mono text-xs font-semibold text-red-600 shrink-0 bg-red-100 px-1.5 py-0.5 rounded">
                                Dòng {e.line}
                            </span>
                            {e.message && (
                                <span className="text-xs text-red-800 leading-snug">{e.message}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── CustomContentInput ──────────────────────────────────────────────────────
export const CustomContentInput = ({
    value,
    onChange,
    disabled = false,
    // Preferred: rowErrors = [{ line, message }]
    rowErrors = [],
    // Legacy: rowIndexes = [3, 7]  (no message, backward compat)
    rowIndexes = [],
    // Answer key props
    sectionType,       // 'trac-nghiem' | 'dung-sai' | 'tra-loi-ngan'
    answerValue = '',
    onAnswerChange,
}) => {
    const [viewMode, setViewMode] = useState('text')

    // Merge legacy rowIndexes (no message) with rowErrors, deduplicate, sort
    const mergedErrors = [
        ...rowErrors,
        ...rowIndexes
            .filter(n => !rowErrors.some(e => e.line === n))
            .map(n => ({ line: n, message: '' })),
    ].sort((a, b) => a.line - b.line)

    const overLimit = (value?.length || 0) > 15000

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">
                    Nội dung tùy chỉnh
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        title="Lược bỏ ký hiệu markdown (tiêu đề, bảng, đường kẻ)"
                        onClick={() => onChange(stripMarkdown(value || ''))}
                        disabled={disabled || !value}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium
                                   text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100
                                   rounded-lg border border-zinc-200 transition
                                   disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Eraser className="w-3.5 h-3.5" />
                        Lọc ký hiệu
                    </button>
                    <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
                </div>
            </div>

            {/* Editor / Preview */}
            {viewMode === 'text' ? (
                <div className="space-y-2">
                    {/* Answer key bar — shown above the editor when sectionType given */}
                    {sectionType && onAnswerChange && (
                        <AnswerKeyBar
                            sectionType={sectionType}
                            value={answerValue}
                            onChange={onAnswerChange}
                            disabled={disabled}
                        />
                    )}

                    <CodeTextarea
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder="Nhập nội dung markdown..."
                        rowErrors={mergedErrors}
                    />

                    {/* Problems panel */}
                    <ErrorPanel rowErrors={mergedErrors} />

                    <div className="flex items-center justify-between">
                        <span className={`text-xs px-1 ${overLimit ? 'text-red-600 font-medium' : 'text-foreground-light'}`}>
                            {value?.length || 0} / 15,000 ký tự
                        </span>
                    </div>

                    {overLimit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                            <p className="text-xs text-red-700">
                                ⚠️ Nội dung vượt quá giới hạn. Chỉ cho phép tách tối đa 15,000 ký tự.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 max-h-80 overflow-y-auto">
                    {value ? (
                        <MarkdownRenderer content={value} className="text-sm" />
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Edit className="w-6 h-6 text-zinc-500" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Chưa có nội dung tùy chỉnh
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            {viewMode === 'text' && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
                    <p className="text-xs text-zinc-600 leading-relaxed">
                        Hỗ trợ <b>Markdown</b>.
                        Ví dụ: <code className="px-1 bg-zinc-100 rounded">**bold**</code>,{' '}
                        <code className="px-1 bg-zinc-100 rounded">![media:123](media:123)</code>
                    </p>
                </div>
            )}
        </div>
    )
}
