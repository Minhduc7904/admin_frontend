import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const NewsArticleThumbnailField = ({ mediaId, viewUrl, onOpen, onClear, error }) => (
    <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Ảnh đại diện</label>
        <div className={`overflow-hidden rounded-sm border ${error ? 'border-red-500' : 'border-border'}`}>
            {viewUrl ? (
                <div className="relative aspect-[16/8] bg-gray-50">
                    <img src={viewUrl} alt="Ảnh đại diện bài viết" className="h-full w-full object-cover" />
                    <button type="button" onClick={onClear} className="absolute right-2 top-2 rounded-sm bg-white/90 p-1 text-foreground-light shadow hover:text-red-600" title="Bỏ ảnh đại diện"><X size={17} /></button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                    <div className="rounded-full bg-gray-100 p-3 text-foreground-light"><ImageIcon size={22} /></div>
                    <div className="text-sm font-medium text-foreground">Chưa chọn ảnh đại diện</div>
                    <div className="text-xs text-foreground-light">Media #{mediaId || '—'} · Nên dùng ảnh tỷ lệ 16:8</div>
                </div>
            )}
            <div className="flex items-center justify-between gap-3 border-t border-border bg-gray-50 p-3">
                <span className="truncate text-xs text-foreground-light">{mediaId ? `Đang dùng Media #${mediaId}` : 'Ảnh giúp bài viết dễ nhận diện hơn'}</span>
                <div className="flex gap-2">
                    {mediaId && <Button type="button" variant="outline" onClick={onClear}>Bỏ chọn</Button>}
                    <Button type="button" onClick={onOpen}>{mediaId ? 'Đổi ảnh' : 'Chọn ảnh'}</Button>
                </div>
            </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);
