import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Code2, Heading1, Heading2, Image as ImageIcon, Italic, Link as LinkIcon,
    List, ListOrdered, Quote, Redo2, RemoveFormatting, Strikethrough, Undo2, Video,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getPresignedUploadUrlAsync, postUploadCompleteAsync } from '../../media/store/mediaSlice';
import { newsContentToHtml } from '../utils/newsContent.utils';
import { NewsMediaNodeView } from './NewsMediaNodeView';

const createMediaNode = (name, tag) => Node.create({
    name,
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            mediaId: { default: null },
            alt: { default: '' },
            src: { default: null },
            viewUrl: { default: null },
        };
    },
    parseHTML() {
        return [{ tag }];
    },
    renderHTML({ HTMLAttributes }) {
        const { mediaId, alt } = HTMLAttributes;
        const attributes = name === 'video'
            ? { src: `media:${mediaId}`, controls: 'true' }
            : { src: `media:${mediaId}`, alt: alt || '' };
        return [tag, mergeAttributes(attributes)];
    },
    addNodeView() {
        return ReactNodeViewRenderer(NewsMediaNodeView);
    },
});

const NewsImage = createMediaNode('image', 'img');
const NewsVideo = createMediaNode('video', 'video');

const ToolbarButton = ({ active, title, children, onClick, disabled = false }) => (
    <button
        type="button"
        title={title}
        disabled={disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className={`rounded-sm p-2 transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-foreground-light hover:bg-gray-100 hover:text-foreground'} disabled:cursor-not-allowed disabled:opacity-40`}
    >
        {children}
    </button>
);

export const NewsArticleEditor = ({ value, error, onChange }) => {
    const dispatch = useDispatch();
    const [pickerType, setPickerType] = useState(null);
    const [isUploadingClipboardImage, setIsUploadingClipboardImage] = useState(false);
    const valueRef = useRef(JSON.stringify(value || {}));
    const onChangeRef = useRef(onChange);
    const editorRef = useRef(null);
    const uploadClipboardImage = useCallback(async (file) => {
        const currentEditor = editorRef.current;
        if (!file || !currentEditor || isUploadingClipboardImage) return;

        const localPreview = URL.createObjectURL(file);
        setIsUploadingClipboardImage(true);
        try {
            const presigned = await dispatch(getPresignedUploadUrlAsync({
                originalFilename: file.name || 'pasted-image.png',
                mimeType: file.type || 'image/png',
                fileSize: file.size,
                type: 'IMAGE',
                folderId: null,
            })).unwrap();

            await axios.put(presigned.data.uploadUrl, file, {
                headers: { 'Content-Type': file.type || 'image/png' },
            });

            const completed = await dispatch(postUploadCompleteAsync({
                mediaId: presigned.data.mediaId,
                uploadedSize: file.size,
            })).unwrap();
            const media = completed.data;

            editorRef.current?.chain().focus().insertContent({
                type: 'image',
                attrs: {
                    mediaId: Number(media.mediaId),
                    alt: file.name ? file.name.replace(/\.[^.]+$/, '') : '',
                    src: media.viewUrl || localPreview,
                    viewUrl: media.viewUrl || localPreview,
                },
            }).run();
        } catch (uploadError) {
            console.error('Không thể tải ảnh từ clipboard:', uploadError);
            URL.revokeObjectURL(localPreview);
        } finally {
            setIsUploadingClipboardImage(false);
        }
    }, [dispatch, isUploadingClipboardImage]);
    const extensions = useMemo(() => [
        StarterKit.configure({ codeBlock: { HTMLAttributes: { class: 'rounded-sm bg-gray-900 p-3 text-sm text-white' } } }),
        Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: 'text-blue-700 underline' } }),
        Placeholder.configure({ placeholder: 'Viết nội dung bài viết tại đây…' }),
        NewsImage,
        NewsVideo,
    ], []);
    const editor = useEditor({
        extensions,
        content: value,
        editorProps: {
            attributes: { class: 'min-h-[420px] px-5 py-4 text-sm leading-7 text-foreground focus:outline-none' },
            handlePaste: (_view, event) => {
                const item = Array.from(event.clipboardData?.items || []).find((clipboardItem) => clipboardItem.type.startsWith('image/'));
                const file = item?.getAsFile();
                if (!file) return false;
                uploadClipboardImage(file);
                return true;
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            const contentJson = currentEditor.getJSON();
            valueRef.current = JSON.stringify(contentJson);
            onChangeRef.current({
                contentJson,
                contentHtml: newsContentToHtml(contentJson),
                contentText: currentEditor.getText(),
            });
        },
    });

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        editorRef.current = editor;
        return () => {
            editorRef.current = null;
        };
    }, [editor]);

    useEffect(() => {
        if (!editor) return;
        const nextValue = JSON.stringify(value || {});
        if (nextValue !== valueRef.current) {
            editor.commands.setContent(value || { type: 'doc', content: [{ type: 'paragraph' }] }, { emitUpdate: false });
            valueRef.current = nextValue;
        }
    }, [editor, value]);

    const insertMedia = (mediaId, media) => {
        if (!mediaId || !editor || !pickerType) return;
        editor.chain().focus().insertContent({
            type: pickerType === 'VIDEO' ? 'video' : 'image',
            attrs: {
                mediaId: Number(mediaId),
                alt: media?.alt || media?.originalName || media?.fileName || '',
                src: media?.viewUrl || null,
                viewUrl: media?.viewUrl || null,
            },
        }).run();
        setPickerType(null);
    };

    const setLink = () => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('Nhập URL liên kết', previousUrl || 'https://');
        if (url === null) return;
        if (!url) editor.chain().focus().extendMarkRange('link').unsetLink().run();
        else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    if (!editor) return <div className="rounded-sm border border-border p-6 text-sm text-foreground-light">Đang tải trình soạn thảo…</div>;

    return (
        <>
            <div>
                <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Nội dung bài viết <span className="text-red-500">*</span></label>
                    <span className="text-xs text-foreground-light">{editor.storage.characterCount?.characters?.() || editor.getText().length} ký tự</span>
                </div>
                <div className={`overflow-hidden rounded-sm border bg-white ${error ? 'border-red-500' : 'border-border'}`}>
                    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-gray-50 p-2">
                        <ToolbarButton title="Hoàn tác" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={17} /></ToolbarButton>
                        <ToolbarButton title="Làm lại" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={17} /></ToolbarButton>
                        <span className="mx-1 h-6 border-l border-border" />
                        <ToolbarButton title="Tiêu đề lớn" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={17} /></ToolbarButton>
                        <ToolbarButton title="Tiêu đề vừa" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={17} /></ToolbarButton>
                        <ToolbarButton title="In đậm" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={17} /></ToolbarButton>
                        <ToolbarButton title="In nghiêng" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={17} /></ToolbarButton>
                        <ToolbarButton title="Gạch ngang" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={17} /></ToolbarButton>
                        <ToolbarButton title="Liên kết" active={editor.isActive('link')} onClick={setLink}><LinkIcon size={17} /></ToolbarButton>
                        <ToolbarButton title="Bỏ định dạng" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><RemoveFormatting size={17} /></ToolbarButton>
                        <span className="mx-1 h-6 border-l border-border" />
                        <ToolbarButton title="Danh sách" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={17} /></ToolbarButton>
                        <ToolbarButton title="Danh sách số" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={17} /></ToolbarButton>
                        <ToolbarButton title="Trích dẫn" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={17} /></ToolbarButton>
                        <ToolbarButton title="Khối mã" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 size={17} /></ToolbarButton>
                        <span className="mx-1 h-6 border-l border-border" />
                        <ToolbarButton title="Chèn ảnh từ Media" onClick={() => setPickerType('IMAGE')}><ImageIcon size={17} /></ToolbarButton>
                        <ToolbarButton title="Chèn video từ Media" onClick={() => setPickerType('VIDEO')}><Video size={17} /></ToolbarButton>
                    </div>
                    <EditorContent editor={editor} />
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                <p className="mt-2 text-xs text-foreground-light">Bạn có thể dán ảnh trực tiếp bằng Ctrl/Cmd + V: hệ thống sẽ tự tải ảnh lên Media và chèn Media ID vào bài viết.</p>
            </div>

            {isUploadingClipboardImage && (
                <div className="mt-2 flex items-center gap-2 text-xs text-blue-700">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
                    Đang tải ảnh từ clipboard lên thư viện media…
                </div>
            )}

            <MediaPickerModal
                isOpen={Boolean(pickerType)}
                onClose={() => setPickerType(null)}
                onSave={insertMedia}
                title={pickerType === 'VIDEO' ? 'Chèn video vào bài viết' : 'Chèn ảnh vào bài viết'}
                type={pickerType || 'IMAGE'}
            />
        </>
    );
};
