import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Images, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Select } from '../../../../shared/components/ui';
import { getSeoPageByPageKey, getSlotAcceptConfig } from '../../constants/seoMedia.constant';
import {
  createItemAsync,
  getItemsBySlotAsync,
  getSlotsAsync,
  selectSeoItems,
  selectSeoLoading,
  selectSeoLoadingItem,
  selectSeoPageMediaActivePageKey,
  selectSeoPageMediaSelectedSlotId,
  selectSeoSlotsByPageKey,
  setSeoPageMediaSelectedSlotId,
} from '../../store/seoMediaSlice';
import { SeoMediaPickerModal } from './SeoMediaPickerModal';
import {
  buildSeoMediaPayload,
  getMediaKey,
  getMediaName,
  getSeoMediaType,
  isAcceptedSeoMediaItem,
} from '../../utils/seoMediaPicker.utils';

const getSlotRemainingCount = (slot, itemCount) => {
  if (!slot || slot.maxItems === null || slot.maxItems === undefined) return null;
  return Math.max(Number(slot.maxItems) - itemCount, 0);
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
  return `${slot.minItems || 0} - ${slot.maxItems} media`;
};

export const SeoPageSlotPanel = () => {
  const dispatch = useDispatch();
  const activePageKey = useSelector(selectSeoPageMediaActivePageKey);
  const selectedSlotId = useSelector(selectSeoPageMediaSelectedSlotId);
  const slotsByPageKey = useSelector(selectSeoSlotsByPageKey);
  const loading = useSelector(selectSeoLoading);
  const itemLoading = useSelector(selectSeoLoadingItem);
  const items = useSelector(selectSeoItems);

  const activePage = getSeoPageByPageKey(activePageKey);
  const slots = useMemo(() => slotsByPageKey[activePageKey] || [], [activePageKey, slotsByPageKey]);
  const selectedSlot = slots.find((slot) => String(slot.slotId) === String(selectedSlotId)) || null;
  const selectedSlotAcceptConfig = useMemo(
    () => getSlotAcceptConfig(selectedSlot?.type),
    [selectedSlot?.type],
  );
  const selectedSlotMediaType = useMemo(
    () => getSeoMediaType(selectedSlot?.type),
    [selectedSlot?.type],
  );
  const remainingSlotCount = getSlotRemainingCount(selectedSlot, items.length);

  const [openSeoMediaPicker, setOpenSeoMediaPicker] = useState(false);
  const [selectedMediaItems, setSelectedMediaItems] = useState([]);
  const [alt, setAlt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [mediaError, setMediaError] = useState('');

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
    setSelectedMediaItems([]);
    setMediaError('');
    setLinkUrl('');
    setAlt(nextSlot ? `${activePage?.name || ''} - ${nextSlot.name}`.trim() : '');
    dispatch(setSeoPageMediaSelectedSlotId(value || null));
  };

  const slotOptions = slots.map((slot) => ({
    value: slot.slotId,
    label: slot.name,
  }));

  const handleSaveSeoMediaSelection = (mediaItems) => {
    setSelectedMediaItems(mediaItems);
    setMediaError('');
    setOpenSeoMediaPicker(false);
  };

  const handleRemoveSelectedMedia = (media) => {
    const mediaKey = getMediaKey(media);
    setSelectedMediaItems((current) => current.filter((item) => getMediaKey(item) !== mediaKey));
    setMediaError('');
  };

  const handleClearSelectedMedia = () => {
    setSelectedMediaItems([]);
    setMediaError('');
  };

  const handleAddSelectedMedia = async () => {
    if (!selectedSlot?.slotId || selectedMediaItems.length === 0 || itemLoading) return;

    if (remainingSlotCount !== null && selectedMediaItems.length > remainingSlotCount) {
      setMediaError(`Slot này chỉ còn được thêm ${remainingSlotCount} media.`);
      return;
    }

    const invalidMedia = selectedMediaItems.find((media) => !isAcceptedSeoMediaItem(media, selectedSlotAcceptConfig));
    if (invalidMedia) {
      setMediaError(`Media "${getMediaName(invalidMedia)}" không đúng định dạng ${selectedSlotAcceptConfig.label}.`);
      return;
    }

    const missingRequired = selectedMediaItems.find((media) => {
      const payload = buildSeoMediaPayload(media);
      return !payload.objectKey || !payload.originalName || !payload.mimeType || !payload.fileSize;
    });

    if (missingRequired) {
      setMediaError(`Media "${getMediaName(missingRequired)}" thiếu objectKey, mimeType hoặc fileSize.`);
      return;
    }

    try {
      await Promise.all(selectedMediaItems.map((media, index) => dispatch(createItemAsync({
        slotId: selectedSlot.slotId,
        ...buildSeoMediaPayload(media),
        sortOrder: items.length + index,
        alt: alt.trim() || media.alt || undefined,
        linkUrl: linkUrl.trim() || undefined,
      })).unwrap()));

      handleClearSelectedMedia();
      await dispatch(getItemsBySlotAsync({
        slotId: selectedSlot.slotId,
        params: { page: 1, limit: 20, includeSlot: false },
      }));
    } catch (error) {
      console.error('Create SEO media item failed:', error);
      setMediaError('Không thêm được media vào slot SEO.');
    }
  };

  return (
    <>
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
            placeholder="Mô tả ảnh hoặc video"
            disabled={!selectedSlot}
          />

          <Input
            label="Link khi click media"
            name="linkUrl"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={!selectedSlot}
          />

          <div className="border-2 border-dashed border-border rounded-sm bg-gray-50 px-4 py-6 text-center">
            <div className="mx-auto w-10 h-10 rounded-sm bg-white border border-border flex items-center justify-center">
              <Images size={18} className="text-foreground-light" />
            </div>

            <div className="text-sm font-medium text-foreground mt-3">
              {selectedMediaItems.length > 0
                ? `Đã chọn ${selectedMediaItems.length} media SEO`
                : 'Chọn hoặc upload media trong SEO bucket'}
            </div>
            <div className="text-xs text-foreground-light mt-1">{selectedSlotAcceptConfig.label}</div>

            {selectedMediaItems.length > 0 && (
              <div className="mt-3 space-y-1 text-left">
                {selectedMediaItems.map((media) => (
                  <div
                    key={getMediaKey(media)}
                    className="flex items-center justify-between gap-2 rounded-sm border border-border bg-white px-2 py-1 text-xs text-foreground-light"
                    title={getMediaName(media)}
                  >
                    <span className="truncate">{getMediaName(media)}</span>
                    <button
                      type="button"
                      className="text-foreground-light hover:text-red-600"
                      onClick={() => handleRemoveSelectedMedia(media)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!selectedSlot || itemLoading}
                onClick={() => setOpenSeoMediaPicker(true)}
              >
                <Images size={16} />
                Chọn media SEO
              </Button>
              {selectedMediaItems.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={itemLoading}
                  onClick={handleClearSelectedMedia}
                >
                  <X size={16} />
                  Bỏ chọn
                </Button>
              )}
            </div>
          </div>

          {mediaError && (
            <div className="px-3 py-2 rounded-sm bg-red-50 text-xs text-red-600">
              {mediaError}
            </div>
          )}

          {!slots.length && (
            <div className="px-3 py-2 rounded-sm bg-gray-50 text-xs text-foreground-light">
              {loading ? 'Đang tải slot...' : 'Page này chưa có slot. Hãy tạo slot ở trang Quản lý SEO slots trước.'}
            </div>
          )}

          <Button
            className="w-full"
            loading={itemLoading}
            disabled={!selectedSlot || selectedMediaItems.length === 0 || itemLoading}
            onClick={handleAddSelectedMedia}
          >
            <ImagePlus size={16} />
            Thêm {selectedMediaItems.length || ''} media vào slot
          </Button>
        </div>
      </section>

      <SeoMediaPickerModal
        isOpen={openSeoMediaPicker}
        onClose={() => setOpenSeoMediaPicker(false)}
        onSave={handleSaveSeoMediaSelection}
        selectedItems={selectedMediaItems}
        title="Chọn media SEO"
        mediaType={selectedSlotMediaType}
        acceptConfig={selectedSlotAcceptConfig}
        remainingCount={remainingSlotCount}
        multiple
      />
    </>
  );
};
