import { useEffect, useMemo, useState } from 'react';
import { GripVertical, ImageOff, Link as LinkIcon, RefreshCw, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../shared/components/ui';
import { getSeoPageByPageKey } from '../../constants/seoMedia.constant';
import {
  deleteItemAsync,
  getItemsBySlotAsync,
  reorderItemsAsync,
  selectSeoItems,
  selectSeoLoadingItem,
  selectSeoPageMediaActivePageKey,
  selectSeoPageMediaSelectedSlotId,
  selectSeoPageMediaViewMode,
  selectSeoSlotsByPageKey,
} from '../../store/seoMediaSlice';
import { resolveSeoMediaUrl } from '../../utils/seoMediaUrl';

const SLIDE_DURATION = 4500;

const sortItems = (items) => {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
};

const getPreviewAspectRatio = (slot) => {
  if (slot?.recommendedWidth && slot?.recommendedHeight) {
    return `${slot.recommendedWidth} / ${slot.recommendedHeight}`;
  }

  return '16 / 9';
};

const isVideoItem = (item) => item?.mimeType?.startsWith('video/');

const SeoMediaItemPreview = ({ item, className, controls = false }) => {
  const src = resolveSeoMediaUrl(item.publicUrl);

  if (isVideoItem(item)) {
    return (
      <video
        src={src}
        className={className}
        controls={controls}
        muted={!controls}
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={src}
      alt={item.alt || item.originalName || 'SEO media preview'}
      className={className}
    />
  );
};

export const SeoMediaPreview = () => {
  const dispatch = useDispatch();
  const activePageKey = useSelector(selectSeoPageMediaActivePageKey);
  const selectedSlotId = useSelector(selectSeoPageMediaSelectedSlotId);
  const viewMode = useSelector(selectSeoPageMediaViewMode);
  const slotsByPageKey = useSelector(selectSeoSlotsByPageKey);
  const items = useSelector(selectSeoItems);
  const loadingItem = useSelector(selectSeoLoadingItem);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [draggingItemId, setDraggingItemId] = useState(null);

  const activePage = getSeoPageByPageKey(activePageKey);
  const slots = slotsByPageKey[activePageKey] || [];
  const selectedSlot = slots.find((slot) => String(slot.slotId) === String(selectedSlotId));
  const sortedItems = useMemo(() => sortItems(items), [items]);
  const previewItem = sortedItems[selectedIndex];
  const previewIsVideo = isVideoItem(previewItem);
  const previewAspectRatio = getPreviewAspectRatio(selectedSlot);

  const loadItems = () => {
    if (!selectedSlotId) return;
    dispatch(getItemsBySlotAsync({
      slotId: selectedSlotId,
      params: { page: 1, limit: 20, includeSlot: false },
    }));
  };

  useEffect(() => {
    loadItems();
  }, [dispatch, selectedSlotId]);

  useEffect(() => {
    setSelectedIndex(0);
    setProgress(0);
  }, [selectedSlotId]);

  useEffect(() => {
    if (selectedIndex <= sortedItems.length - 1) return;
    setSelectedIndex(Math.max(sortedItems.length - 1, 0));
  }, [selectedIndex, sortedItems.length]);

  useEffect(() => {
    if (sortedItems.length <= 1 || previewIsVideo) {
      setProgress(0);
      return undefined;
    }

    let startedAt = Date.now();
    const timer = window.setInterval(() => {
      const nextProgress = Math.min(((Date.now() - startedAt) / SLIDE_DURATION) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        startedAt = Date.now();
        setProgress(0);
        setSelectedIndex((current) => (current + 1) % sortedItems.length);
      }
    }, 80);

    return () => window.clearInterval(timer);
  }, [previewIsVideo, selectedIndex, sortedItems.length]);

  const handleSelectItem = (index) => {
    setSelectedIndex(index);
    setProgress(0);
  };

  const handleDeleteItem = async (event, item, index) => {
    event.stopPropagation();
    if (!item?.itemId || loadingItem) return;

    try {
      await dispatch(deleteItemAsync(item.itemId)).unwrap();
      setSelectedIndex((current) => {
        if (current > index) return current - 1;
        if (current === index) return Math.max(index - 1, 0);
        return current;
      });
      setProgress(0);
    } catch (error) {
      console.error('Delete SEO media item failed:', error);
    }
  };

  const handleDragStart = (event, item) => {
    setDraggingItemId(item.itemId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(item.itemId));
  };

  const handleDrop = async (event, targetIndex) => {
    event.preventDefault();

    const draggedId = Number(event.dataTransfer.getData('text/plain') || draggingItemId);
    const fromIndex = sortedItems.findIndex((item) => item.itemId === draggedId);
    if (fromIndex === -1 || fromIndex === targetIndex || !selectedSlotId) {
      setDraggingItemId(null);
      return;
    }

    const reorderedItems = [...sortedItems];
    const [draggedItem] = reorderedItems.splice(fromIndex, 1);
    reorderedItems.splice(targetIndex, 0, draggedItem);

    try {
      await dispatch(reorderItemsAsync({
        slotId: selectedSlotId,
        data: {
          items: reorderedItems.map((item, index) => ({
            itemId: item.itemId,
            sortOrder: index,
          })),
        },
      })).unwrap();

      setSelectedIndex(targetIndex);
      setProgress(0);
    } catch (error) {
      console.error('Reorder SEO media items failed:', error);
    } finally {
      setDraggingItemId(null);
    }
  };

  return (
    <section className="xl:col-span-5 bg-white border border-border rounded-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Preview</h2>
          <p className="text-xs text-foreground-light mt-1">{sortedItems.length} ảnh trong slot</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedSlot && (
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedSlot.code}</code>
          )}
          <Button variant="outline" size="sm" onClick={loadItems} disabled={!selectedSlotId || loadingItem}>
            <RefreshCw size={14} className={loadingItem ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div
          className={`mx-auto border border-border rounded-sm overflow-hidden bg-white ${viewMode === 'mobile' ? 'max-w-[280px]' : 'w-full'
            }`}
        >
          <div className="bg-gray-100 overflow-hidden" style={{ aspectRatio: previewAspectRatio }}>
            {sortedItems.length > 0 ? (
              <div
                className="h-full flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
              >
                {sortedItems.map((item) => (
                  <SeoMediaItemPreview
                    key={item.itemId}
                    className="w-full h-full object-cover flex-none"
                    item={item}
                    controls={isVideoItem(item) && item.itemId === previewItem?.itemId}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-foreground-light">
                <ImageOff size={28} />
                <span className="text-xs mt-2">Chưa có ảnh preview</span>
              </div>
            )}
          </div>

          {sortedItems.length > 1 && (
            <div className="px-3 pt-3">
              <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${sortedItems.length}, minmax(0, 1fr))` }}>
                {sortedItems.map((item, index) => (
                  <button
                    key={item.itemId}
                    type="button"
                    onClick={() => handleSelectItem(index)}
                    className="h-1.5 rounded-full bg-gray-200 overflow-hidden"
                    aria-label={`Chọn ảnh ${index + 1}`}
                  >
                    <span
                      className="block h-full rounded-full bg-foreground transition-[width] duration-100"
                      style={{
                        width:
                          index < selectedIndex
                            ? '100%'
                            : index === selectedIndex
                              ? `${progress}%`
                              : '0%',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">{activePage?.name || 'Page'}</h3>
              <p className="text-xs text-foreground-light mt-1">
                {selectedSlot?.name || 'Chưa chọn slot'}
                {previewItem?.originalName ? ` - ${previewItem.originalName}` : ''}
              </p>
            </div>
            <a
              href={`https://beeedu.vn${activePage?.path || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-foreground-light hover:text-foreground transition-colors"
            >
              <LinkIcon size={13} />
              <span className="truncate">
                https://beeedu.vn{activePage?.path || ''}
              </span>
            </a>
          </div>
        </div>

        {sortedItems.length > 0 && (
          <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
            {sortedItems.map((item, index) => {
              const active = index === selectedIndex;
              const dragging = item.itemId === draggingItemId;

              return (
                <div
                  key={item.itemId}
                  role="button"
                  tabIndex={0}
                  draggable={!loadingItem}
                  onDragStart={(event) => handleDragStart(event, item)}
                  onDragEnd={() => setDraggingItemId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, index)}
                  onClick={() => handleSelectItem(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleSelectItem(index);
                    }
                  }}
                  className={`group relative aspect-video border rounded-sm overflow-hidden bg-gray-50 transition ${active ? 'border-foreground ring-2 ring-foreground/10' : 'border-border hover:border-foreground/50'
                    } ${dragging ? 'opacity-50 scale-[0.98]' : ''} cursor-pointer`}
                  title={item.originalName || `Ảnh ${index + 1}`}
                >
                  <SeoMediaItemPreview
                    item={item}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  <span className="absolute left-1 top-1 w-6 h-6 rounded-sm bg-white/90 text-foreground-light opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-grab">
                    <GripVertical size={14} />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => handleDeleteItem(event, item, index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        handleDeleteItem(event, item, index);
                      }
                    }}
                    className="absolute right-1 top-1 w-6 h-6 rounded-sm bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label={`Xóa ảnh ${index + 1}`}
                  >
                    <Trash2 size={13} />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
