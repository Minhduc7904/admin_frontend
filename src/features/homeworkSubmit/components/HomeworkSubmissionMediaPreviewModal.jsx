import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, FileText, ImageOff, Info, Paperclip } from 'lucide-react';
import { Button, Modal, Textarea } from '../../../shared/components';
import {
    getHomeworkSubmissionMedia,
    isHomeworkSubmissionImage,
    isHomeworkSubmissionPdf,
} from '../utils/homeworkSubmissionMedia';

export const HomeworkSubmissionMediaPreviewModal = ({
    attachments,
    initialMediaId,
    isOpen,
    onClose,
    onSaveAlt,
    saving,
}) => {
    const files = attachments;
    const initialIndex = Math.max(0, files.findIndex((attachment) => {
        const media = getHomeworkSubmissionMedia(attachment);
        return (attachment.mediaId ?? media?.mediaId) === initialMediaId;
    }));
    const initialMedia = getHomeworkSubmissionMedia(files[initialIndex]);
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [alt, setAlt] = useState(initialMedia?.alt || '');
    const [error, setError] = useState('');

    const activeAttachment = files[activeIndex];
    const activeMedia = getHomeworkSubmissionMedia(activeAttachment);
    const isImage = isHomeworkSubmissionImage(activeAttachment);
    const isPdf = isHomeworkSubmissionPdf(activeAttachment);
    const fileName = activeMedia?.originalName || activeMedia?.fileName || `Tệp ${activeIndex + 1}`;

    const handleSave = async () => {
        const value = alt.trim();
        if (value.length > 255) {
            setError('Nhận xét cho tệp tối đa 255 ký tự.');
            return;
        }
        await onSaveAlt?.(activeAttachment.mediaId ?? activeMedia.mediaId, value);
    };

    const goTo = (index) => {
        const nextIndex = (index + files.length) % files.length;
        const nextMedia = getHomeworkSubmissionMedia(files[nextIndex]);
        setActiveIndex(nextIndex);
        setAlt(nextMedia?.alt || '');
        setError('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Xem và nhận xét tệp" size="6xl" customContent>
            {!activeMedia ? (
                <div className="flex h-72 items-center justify-center gap-2 text-sm text-muted-foreground"><ImageOff className="h-5 w-5" /> Không tìm thấy ảnh đính kèm.</div>
            ) : (
                <div className="grid min-h-[36rem] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="relative flex min-h-[22rem] items-center justify-center bg-gray-950 p-5">
                        {isImage && (activeMedia.viewUrl ? <img src={activeMedia.viewUrl} alt={activeMedia.alt || fileName} className="max-h-[68vh] max-w-full rounded object-contain" /> : <ImageOff className="h-10 w-10 text-gray-400" />)}
                        {isPdf && (activeMedia.viewUrl ? <iframe src={activeMedia.viewUrl} title={fileName} className="h-[68vh] min-h-[28rem] w-full rounded bg-white" /> : <FileText className="h-10 w-10 text-gray-400" />)}
                        {!isImage && !isPdf && <div className="max-w-md rounded-xl bg-white p-6 text-center"><Paperclip className="mx-auto h-9 w-9 text-info" /><p className="mt-3 break-all text-sm font-semibold text-foreground">{fileName}</p><p className="mt-1 text-xs text-muted-foreground">Định dạng này không có bản xem trước.</p>{activeMedia.viewUrl && <a href={activeMedia.viewUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 rounded bg-info px-3 py-2 text-sm font-medium text-white hover:bg-info-dark">Mở tệp trong tab mới <ExternalLink className="h-3.5 w-3.5" /></a>}</div>}
                        {files.length > 1 && <>
                            <button type="button" onClick={() => goTo(activeIndex - 1)} className="absolute left-4 rounded-full bg-white/90 p-2 text-foreground shadow hover:bg-white" aria-label="Ảnh trước"><ChevronLeft className="h-5 w-5" /></button>
                            <button type="button" onClick={() => goTo(activeIndex + 1)} className="absolute right-4 rounded-full bg-white/90 p-2 text-foreground shadow hover:bg-white" aria-label="Ảnh tiếp theo"><ChevronRight className="h-5 w-5" /></button>
                        </>}
                        <span className="absolute bottom-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white">{activeIndex + 1} / {files.length}</span>
                    </div>
                    <aside className="flex flex-col border-l border-border bg-white p-5">
                        <div className="mb-5">
                            <p className="truncate text-sm font-semibold text-foreground">{fileName}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{isImage ? 'Ảnh được hiển thị trực tiếp trong slide.' : isPdf ? 'Tệp PDF được hiển thị trực tiếp trong slide.' : 'Tệp này hỗ trợ mở trong tab mới.'} Nhận xét được lưu cùng tệp để học sinh xem lại.</p>
                        </div>
                        <Textarea label="Nhận xét cho tệp" rows={7} value={alt} error={error} maxLength={255} onChange={(event) => { setAlt(event.target.value); setError(''); }} placeholder="VD: Bài trình bày đẹp nhưng chữ hơi nhỏ." helperText={`${alt.length}/255 ký tự`} />
                        <div className="mt-4 flex justify-end"><Button onClick={handleSave} loading={saving} disabled={saving}>Lưu nhận xét</Button></div>
                        {files.length > 1 && <div className="mt-6 grid grid-cols-4 gap-2 overflow-y-auto">
                            {files.map((attachment, index) => {
                                const media = getHomeworkSubmissionMedia(attachment);
                                const name = media.originalName || media.fileName || `Tệp ${index + 1}`;
                                return <button key={attachment.mediaId ?? media.mediaId ?? index} type="button" onClick={() => goTo(index)} title={name} className={`aspect-square overflow-hidden rounded border-2 ${index === activeIndex ? 'border-info' : 'border-transparent hover:border-gray-300'}`}>{isHomeworkSubmissionImage(attachment) ? <img src={media.viewUrl} alt={media.alt || name} className="h-full w-full object-cover" /> : <span className="flex h-full flex-col items-center justify-center gap-1 bg-gray-100 text-[10px] font-medium text-foreground-light">{isHomeworkSubmissionPdf(attachment) ? <FileText className="h-5 w-5 text-red-600" /> : <Paperclip className="h-5 w-5 text-info" />}{isHomeworkSubmissionPdf(attachment) ? 'PDF' : 'Tệp'}</span>}</button>;
                            })}
                        </div>}
                        <div className="mt-auto flex items-start gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Nhận xét hỗ trợ cho mọi tệp đính kèm, tối đa 255 ký tự.</div>
                    </aside>
                </div>
            )}
        </Modal>
    );
};
