import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Images, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Select } from '../../../../shared/components/ui';
import { MediaPickerModal } from '../../../media/components';
import { getMediaByIdAsync } from '../../../media/store/mediaSlice';
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

const getPickerMediaType = (slotType) => {
  if (slotType === 'video') return 'VIDEO';
  return 'IMAGE';
};

const getMediaName = (media) => media?.originalName || media?.fileName || `media-${media?.mediaId || ''}`;

const getMediaPublicUrl = (media) => {
  if (!media) return '';
  if (media.publicUrl) return media.publicUrl;
  if (media.url) return media.url;
  if (media.viewUrl) return media.viewUrl;
  if (media.objectKey) return media.objectKey.startsWith('/') ? media.objectKey : `/${media.objectKey}`;
  return '';
};

const isAcceptedSeoMediaItem = (media, acceptConfig) => {
  if (!media) return false;
  if (media.mimeType && acceptConfig.mimeTypes.includes(media.mimeType)) return true;

  const lowerName = getMediaName(media).toLowerCase();
  return acceptConfig.extensions.some((extension) => lowerName.endsWith(extension));
};

const buildSeoMediaPayload = (media) => ({
  bucketName: media.bucketName,
  objectKey: media.objectKey,
  publicUrl: getMediaPublicUrl(media),
  originalName: getMediaName(media),
  mimeType: media.mimeType,
  fileSize: media.fileSize,
  width: media.width,
  height: media.height,
});

const getSlotRemainingCount = (slot, itemCount) => {
  if (!slot || slot.maxItems === null || slot.maxItems === undefined) return null;
  return Math.max(Number(slot.maxItems) - itemCount, 0);
};

const getSlotSizeText = (slot) => {
  if (slot?.recommendedWidth && slot?.recommendedHeight) {
    return `${slot.recommendedWidth} x ${slot.recommendedHeight}`;
  }
  return 'Chua cau hinh';
};

const getSlotLimitText = (slot) => {
  if (!slot) return '-';
  if (slot.maxItems === null || slot.maxItems === undefined) return `Toi thieu ${slot.minItems || 0}`;
  return `${slot.minItems || 0} - ${slot.maxItems} anh`;
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
    () => getPickerMediaType(selectedSlot?.type),
    [selectedSlot?.type],
  );
  const remainingSlotCount = getSlotRemainingCount(selectedSlot, items.length);

  const [openMediaPicker, setOpenMediaPicker] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);
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
    setSelectedMediaIds([]);
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

  const handleMediaSelect = (mediaIds, mediaItems = []) => {
    const nextMediaIds = Array.isArray(mediaIds) ? mediaIds : mediaIds ? [mediaIds] : [];
    setSelectedMediaIds(nextMediaIds);
    setSelectedMediaItems(Array.isArray(mediaItems) ? mediaItems : mediaItems ? [mediaItems] : []);
    setMediaError('');
    setOpenMediaPicker(false);
  };

  const handleClearSelectedMedia = () => {
    setSelectedMediaIds([]);
    setSelectedMediaItems([]);
    setMediaError('');
  };

  const loadSelectedMediaItems = async () => {
    const mediaById = new Map(selectedMediaItems.map((media) => [media.mediaId, media]));
    const mediaItems = [];

    for (const mediaId of selectedMediaIds) {
      const existingMedia = mediaById.get(mediaId);
      if (existingMedia) {
        mediaItems.push(existingMedia);
        continue;
      }

      const response = await dispatch(getMediaByIdAsync(mediaId)).unwrap();
      if (response?.data) mediaItems.push(response.data);
    }

    return mediaItems;
  };

  const handleAddSelectedMedia = async () => {
    if (!selectedSlot?.slotId || selectedMediaIds.length === 0 || itemLoading) return;

    if (remainingSlotCount !== null && selectedMediaIds.length > remainingSlotCount) {
      setMediaError(`Slot nay chi con duoc them ${remainingSlotCount} media.`);
      return;
    }

    try {
      const mediaItems = await loadSelectedMediaItems();

      if (mediaItems.length !== selectedMediaIds.length) {
        setMediaError('Khong tai duoc day du thong tin media da chon.');
        return;
      }

      const invalidMedia = mediaItems.find((media) => !isAcceptedSeoMediaItem(media, selectedSlotAcceptConfig));
      if (invalidMedia) {
        setMediaError(`Media "${getMediaName(invalidMedia)}" khong dung dinh dang ${selectedSlotAcceptConfig.label}.`);
        return;
      }

      await Promise.all(mediaItems.map((media, index) => dispatch(createItemAsync({
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
            label="Chon slot"
            name="slot"
            value={selectedSlotId || ''}
            onChange={(e) => handleSlotChange(e.target.value)}
            options={slotOptions}
            disabled={loading || slotOptions.length === 0}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border rounded-sm px-3 py-2">
              <div className="text-xs text-foreground-light">So luong</div>
              <div className="text-sm font-semibold text-foreground mt-1">{getSlotLimitText(selectedSlot)}</div>
            </div>
            <div className="border border-border rounded-sm px-3 py-2">
              <div className="text-xs text-foreground-light">Kich thuoc</div>
              <div className="text-sm font-semibold text-foreground mt-1">{getSlotSizeText(selectedSlot)}</div>
            </div>
          </div>

          <Input
            label="Alt text"
            name="alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Mo ta anh"
            disabled={!selectedSlot}
          />

          <Input
            label="Link khi click anh"
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
              {selectedMediaIds.length > 0
                ? `Da chon ${selectedMediaIds.length} media`
                : 'Chon media tu thu vien'}
            </div>
            <div className="text-xs text-foreground-light mt-1">{selectedSlotAcceptConfig.label}</div>

            {selectedMediaItems.length > 0 && (
              <div className="mt-3 space-y-1 text-left">
                {selectedMediaItems.slice(0, 4).map((media) => (
                  <div
                    key={media.mediaId}
                    className="truncate rounded-sm border border-border bg-white px-2 py-1 text-xs text-foreground-light"
                    title={getMediaName(media)}
                  >
                    {getMediaName(media)}
                  </div>
                ))}
                {selectedMediaItems.length > 4 && (
                  <div className="text-xs text-foreground-light">
                    +{selectedMediaItems.length - 4} media khac
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!selectedSlot || itemLoading}
                onClick={() => setOpenMediaPicker(true)}
              >
                <Images size={16} />
                Chon media
              </Button>
              {selectedMediaIds.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={itemLoading}
                  onClick={handleClearSelectedMedia}
                >
                  <X size={16} />
                  Bo chon
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
              {loading ? 'Dang tai slot...' : 'Page nay chua co slot. Hay tao slot o trang Quan ly SEO slots truoc.'}
            </div>
          )}

          <Button
            className="w-full"
            loading={itemLoading}
            disabled={!selectedSlot || selectedMediaIds.length === 0 || itemLoading}
            onClick={handleAddSelectedMedia}
          >
            <ImagePlus size={16} />
            Them {selectedMediaIds.length || ''} media vao slot
          </Button>
        </div>
      </section>

      <MediaPickerModal
        isOpen={openMediaPicker}
        onClose={() => setOpenMediaPicker(false)}
        onSave={handleMediaSelect}
        selectedMediaId={selectedMediaIds}
        title="Chon media SEO"
        type={selectedSlotMediaType}
        multiple
      />
    </>
  );
};
