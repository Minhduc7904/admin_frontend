import { useEffect, useState } from 'react';
import { Check, Copy, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

export const QrCodeShare = ({ link, size = 160 }) => {
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const generateQr = async () => {
            if (!link) {
                setQrDataUrl('');
                return;
            }

            setLoading(true);
            try {
                const dataUrl = await QRCode.toDataURL(link, {
                    width: size,
                    margin: 1,
                    errorCorrectionLevel: 'M',
                });
                setQrDataUrl(dataUrl);
            } catch (error) {
                console.error('Generate QR code failed:', error);
                setQrDataUrl('');
            } finally {
                setLoading(false);
            }
        };

        generateQr();
    }, [link, size]);

    const handleCopyQrImage = async () => {
        if (!qrDataUrl) return;

        try {
            const response = await fetch(qrDataUrl);
            const blob = await response.blob();

            if (navigator.clipboard?.write && window.ClipboardItem) {
                const item = new window.ClipboardItem({ [blob.type]: blob });
                await navigator.clipboard.write([item]);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
                return;
            }

            console.warn('Clipboard image API is not supported in this browser.');
        } catch (error) {
            console.error('Copy QR image failed:', error);
        }
    };

    return (
        <div className="inline-flex items-start gap-3 p-3 rounded-lg border border-border bg-gray-50">
            <div className="w-[160px] h-[160px] rounded bg-white border border-border flex items-center justify-center overflow-hidden">
                {loading && <span className="text-xs text-foreground-lighter">Đang tạo QR...</span>}
                {!loading && qrDataUrl && (
                    <img
                        src={qrDataUrl}
                        alt="QR code"
                        className="w-full h-full object-contain"
                    />
                )}
                {!loading && !qrDataUrl && (
                    <div className="flex flex-col items-center gap-1 text-foreground-lighter">
                        <QrCode size={18} />
                        <span className="text-xs">Không có dữ liệu</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleCopyQrImage}
                    disabled={!qrDataUrl || loading}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Sao chép ảnh QR"
                >
                    {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    {copied ? 'Đã sao chép' : 'Sao chép ảnh QR'}
                </button>
                <p className="text-[11px] text-foreground-lighter max-w-[160px] leading-relaxed">
                    Dán vào chat, tài liệu hoặc ứng dụng để chia sẻ mã QR cho học sinh.
                </p>
            </div>
        </div>
    );
};
