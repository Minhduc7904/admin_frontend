import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Select } from '../../../../shared/components/ui';
import { getSeoPageByPageKey, getSlotAcceptConfig } from '../../constants/seoMedia.constant';
import {
  createItemAsync,
  getItemsBySlotAsync,
  getSlotsAsync,
  selectSeoItems,
  selectSeoLoading,
  selectSeoPageMediaActivePageKey,
  selectSeoPageMediaSelectedSlotId,
  selectSeoSlotsByPageKey,
  selectSeoUploadLoading,
  setSeoPageMediaSelectedSlotId,
  uploadSeoImageAsync,
} from '../../store/seoMediaSlice';

const isAcceptedSeoMediaFile = (selectedFile, acceptConfig) => {
  if (!selectedFile) return false;
  if (acceptConfig.mimeTypes.includes(selectedFile.type)) return true;

  const lowerName = selectedFile.name.toLowerCase();
  return acceptConfig.extensions.some((extension) => lowerName.endsWith(extension));
};

const getSlotSizeText = (slot) => {
  if (slot?.recommendedWidth && slot?.recommendedHeight) {
    return `${slot.recommendedWidth} x ${slot.recommendedHeight}`;
  }
  return 'Chưa cấu hình';
};

const getSlotLimitText = (slot) => {
  if (!slot) return '-';
  if (slot.maxItems === null || slot.maxItems === undefined) return `Tối thiểu ${slot.minItems || 0}`;
  return `${slot.minItems || 0} - ${slot.maxItems} ảnh`;
};

export const SeoPageSlotPanel = () => {
  const dispatch = useDispatch();
  const activePageKey = useSelector(selectSeoPageMediaActivePageKey);
  const selectedSlotId = useSelector(selectSeoPageMediaSelectedSlotId);
  const slotsByPageKey = useSelector(selectSeoSlotsByPageKey);
  const loading = useSelector(selectSeoLoading);
  const uploadLoading = useSelector(selectSeoUploadLoading);
  const items = useSelector(selectSeoItems);

  const activePage = getSeoPageByPageKey(activePageKey);
  const slots = useMemo(() => slotsByPageKey[activePageKey] || [], [activePageKey, slotsByPageKey]);
  const selectedSlot = slots.find((slot) => String(slot.slotId) === String(selectedSlotId)) || null;
  const selectedSlotAcceptConfig = useMemo(
    () => getSlotAcceptConfig(selectedSlot?.type),
    [selectedSlot?.type],
  );
  const selectedSlotAccept = useMemo(
    () => [...selectedSlotAcceptConfig.mimeTypes, ...selectedSlotAcceptConfig.extensions].join(','),
    [selectedSlotAcceptConfig],
  );

  const [file, setFile] = useState(null);
  const [alt, setAlt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    dispatch(getSlotsAsync({ page: 1, limit: 100, includeItems: true, pageKey: activePageKey }));
  }, [activePageKey, dispatch]);

  useEffect(() => {
    if (!slots.length) {
      dispatch(setSeoPageMediaSelectedSlotId(null));
      return;
    }

    const stillExists = slots.some((slot) => String(slot.slotId) === String(selectedSlotId));
    if (!stillExists) {
      dispatch(setSeoPageMediaSelectedSlotId(slots[0].slotId));
    }
  }, [dispatch, selectedSlotId, slots]);

  const handleSlotChange = (value) => {
    const nextSlot = slots.find((slot) => String(slot.slotId) === String(value)) || null;
    setFile(null);
    setFileError('');
    setLinkUrl('');
    setAlt(nextSlot ? `${activePage?.name || ''} - ${nextSlot.name}`.trim() : '');
    dispatch(setSeoPageMediaSelectedSlotId(value || null));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    if (!selectedFile) {
      setFile(null);
      setFileError('');
      return;
    }

    if (!isAcceptedSeoMediaFile(selectedFile, selectedSlotAcceptConfig)) {
      setFile(null);
      setFileError(`File khong duoc ho tro. Hay chon ${selectedSlotAcceptConfig.label}.`);
      event.target.value = '';
      return;
    }

    setFile(selectedFile);
    setFileError('');
  };

  const slotOptions = slots.map((slot) => ({
    value: slot.slotId,
    label: slot.name,
  }));

  const handleUpload = async () => {
    if (!selectedSlot?.slotId || !file || !isAcceptedSeoMediaFile(file, selectedSlotAcceptConfig)) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploaded = await dispatch(uploadSeoImageAsync(formData)).unwrap();
      const metadata = uploaded?.data;
      if (!metadata) return;

      await dispatch(createItemAsync({
        slotId: selectedSlot.slotId,
        ...metadata,
        sortOrder: items.length,
        alt: alt.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
      })).unwrap();

      setFile(null);
      setFileError('');
      await dispatch(getItemsBySlotAsync({
        slotId: selectedSlot.slotId,
        params: { page: 1, limit: 20, includeSlot: false },
      }));
    } catch (error) {
      console.error('Create SEO media item failed:', error);
    }
  };

  return (
    <section className="xl:col-span-4 bg-white border border-border rounded-sm">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Slot</h2>
      </div>

      <div className="p-4 space-y-4">
        <Select
          label="Chọn slot"
          name="slot"
          value={selectedSlotId || ''}
          onChange={(e) => handleSlotChange(e.target.value)}
          options={slotOptions}
          disabled={loading || slotOptions.length === 0}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="border border-border rounded-sm px-3 py-2">
            <div className="text-xs text-foreground-light">Số lượng</div>
            <div className="text-sm font-semibold text-foreground mt-1">{getSlotLimitText(selectedSlot)}</div>
          </div>
          <div className="border border-border rounded-sm px-3 py-2">
            <div className="text-xs text-foreground-light">Kích thước</div>
            <div className="text-sm font-semibold text-foreground mt-1">{getSlotSizeText(selectedSlot)}</div>
          </div>
        </div>

        <Input
          label="Alt text"
          name="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Mô tả ảnh"
          disabled={!selectedSlot}
        />

        <Input
          label="Link khi click ảnh"
          name="linkUrl"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={!selectedSlot}
        />

        <div className="relative border-2 border-dashed border-border rounded-sm bg-gray-50 px-4 py-8 text-center">
          <input
            type="file"
            accept={selectedSlotAccept}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Upload SEO media"
            disabled={!selectedSlot || uploadLoading}
            onChange={handleFileChange}
          />
          <div className="mx-auto w-10 h-10 rounded-sm bg-white border border-border flex items-center justify-center">
            <Upload size={18} className="text-foreground-light" />
          </div>
          <div className="text-sm font-medium text-foreground mt-3">
            {file ? file.name : 'Keo media vao day hoac chon file'}
          </div>
          <div className="text-xs text-foreground-light mt-1">{selectedSlotAcceptConfig.label}</div>
        </div>

        {fileError && (
          <div className="px-3 py-2 rounded-sm bg-red-50 text-xs text-red-600">
            {fileError}
          </div>
        )}

        {!slots.length && (
          <div className="px-3 py-2 rounded-sm bg-gray-50 text-xs text-foreground-light">
            {loading ? 'Đang tải slot...' : 'Page này chưa có slot. Hãy tạo slot ở trang Quản lý SEO slots trước.'}
          </div>
        )}

        <Button
          className="w-full"
          loading={uploadLoading}
          disabled={!selectedSlot || !file || uploadLoading}
          onClick={handleUpload}
        >
          <ImagePlus size={16} />
          Them media vao slot
        </Button>
      </div>
    </section>
  );
};
