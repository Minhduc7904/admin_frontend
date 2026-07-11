import { NodeViewWrapper } from '@tiptap/react';
import { Image as ImageIcon, Trash2, Video } from 'lucide-react';

export const NewsMediaNodeView = ({ node, deleteNode, updateAttributes }) => {
    const isVideo = node.type.name === 'video';
    const src = node.attrs.viewUrl || node.attrs.src;
    const label = isVideo ? 'Video' : 'Ảnh';

    return (
        <NodeViewWrapper className="my-4 overflow-hidden rounded-sm border border-border bg-gray-50" data-drag-handle>
            <div className="flex items-center justify-between gap-3 border-b border-border bg-white px-3 py-2 text-xs text-foreground-light">
                <span className="flex items-center gap-2 font-medium text-foreground">
                    {isVideo ? <Video size={15} /> : <ImageIcon size={15} />}
                    {label} · Media #{node.attrs.mediaId}
                </span>
                <button
                    type="button"
                    className="rounded p-1 text-foreground-light hover:bg-red-50 hover:text-red-600"
                    onClick={deleteNode}
                    title={`Xóa ${label.toLowerCase()} khỏi nội dung`}
                >
                    <Trash2 size={15} />
                </button>
            </div>
            {src ? (
                isVideo ? (
                    <video className="max-h-[420px] w-full bg-black" controls src={src} />
                ) : (
                    <img className="max-h-[520px] w-full object-contain" src={src} alt={node.attrs.alt || `Media #${node.attrs.mediaId}`} />
                )
            ) : (
                <div className="flex h-36 items-center justify-center text-sm text-foreground-light">
                    Không thể xem trước media này
                </div>
            )}
            <div className="border-t border-border bg-white p-3" contentEditable={false}>
                <label className="mb-1 block text-xs font-medium text-foreground">
                    Alt media
                </label>
                <input
                    type="text"
                    value={node.attrs.alt || ''}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => updateAttributes({ alt: event.target.value })}
                    placeholder={isVideo ? 'Mô tả ngắn cho video' : 'Mô tả ảnh cho SEO và hỗ trợ truy cập'}
                    className="w-full rounded-sm border border-border bg-primary px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
                />
                <p className="mt-1 text-xs text-foreground-light">Alt này được lưu cùng Media #{node.attrs.mediaId} trong contentJson.</p>
            </div>
        </NodeViewWrapper>
    );
};
