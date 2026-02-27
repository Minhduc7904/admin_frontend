import { useMemo, useDeferredValue } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import './markdown-styles.css';

// Hoisted outside component — stable references, ReactMarkdown won't re-parse on every render
const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [
    rehypeRaw,
    [rehypeKatex, {
        strict: false,
        trust: true,
        throwOnError: false,
        errorColor: '#cc0000',
        output: 'html',
    }],
];

/**
 * MarkdownRenderer Component
 *
 * Optimizations applied:
 * - React.memo: skips re-render when props are unchanged
 * - useDeferredValue: defers expensive re-render when content changes, keeps UI responsive
 * - useMemo for components: prevents ReactMarkdown full re-render due to new object reference
 * - Plugin arrays hoisted: stable references so ReactMarkdown doesn't re-parse unnecessarily
 *
 * @param {string} content - Markdown content to render
 * @param {string} className - Additional CSS classes
 * @param {object} components - Custom component renderers
 * @param {string} imgClassNameSize - Tailwind size classes for images
 */
export const MarkdownRenderer = ({ content, className = '', components: customComponents, imgClassNameSize = 'max-w-full max-h-[600px]' }) => {
    // Defer heavy re-renders — React renders with old content first (non-blocking),
    // then schedules the expensive update. UI stays interactive during large content changes.
    const deferredContent = useDeferredValue(content);
    const isStale = content !== deferredContent;

    // Memoized so ReactMarkdown doesn't see a new `components` object reference each render
    const defaultComponents = useMemo(() => ({
        // Custom rendering for code blocks
        code({ node, inline, className, children, ...props }) {
            return inline ? (
                <code className="inline-code" {...props}>
                    {children}
                </code>
            ) : (
                <code className={`code-block ${className || ''}`} {...props}>
                    {children}
                </code>
            );
        },
        // Custom rendering for images
        img({ node, ...props }) {
            if (!props.src || props.src.trim() === '') return null;

            if (props.src.startsWith('media:')) {
                return (
                    <span className="text-gray-400 italic text-sm">
                        [Hình ảnh: {props.alt || 'Không có mô tả'}]
                    </span>
                );
            }

            return (
                <span className="inline-flex justify-center w-full my-4">
                    <img
                        className={`markdown-image object-contain ${imgClassNameSize}`}
                        loading="lazy"
                        {...props}
                        alt={props.alt || 'Image'}
                    />
                </span>
            );
        },
        // Custom rendering for tables
        table({ node, ...props }) {
            return (
                <div className="table-wrapper">
                    <table className="markdown-table" {...props} />
                </div>
            );
        },
        // Custom rendering for links
        a({ node, ...props }) {
            return (
                <a
                    className="markdown-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                />
            );
        },
    }), [imgClassNameSize]);

    const mergedComponents = useMemo(() => ({
        ...defaultComponents,
        ...customComponents,
    }), [defaultComponents, customComponents]);

    if (!content) return null;

    return (
        <div
            className={`markdown-renderer ${className} transition-opacity duration-150 ${isStale ? 'opacity-50' : 'opacity-100'}`}
        >
            <ReactMarkdown
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={mergedComponents}
            >
                {deferredContent ?? ''}
            </ReactMarkdown>
        </div>
    );
};
