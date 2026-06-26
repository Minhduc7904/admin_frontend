import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, FileVideo, Image as ImageIcon, RefreshCw, Search, Upload, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Tabs } from '../../../../shared/components/ui';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { InlineLoading } from '../../../../shared/components/loading';
import {
  getSeoBucketMediaAsync,
  selectSeoUploadLoading,
  uploadSeoMediaAsync,
} from '../../store/seoMediaSlice';
import { resolveSeoMediaUrl } from '../../utils/seoMediaUrl';
import {
  getMediaKey,
  getMediaName,
  getMediaPublicUrl,
  isAcceptedFile,
  isAcceptedSeoMediaItem,
  isVideoMedia,
} from '../../utils/seoMediaPicker.utils';

const SeoMediaGridItem = ({ media, selected, onClick, multiple }) => {
  const src = resolveSeoMediaUrl(getMediaPublicUrl(media));
  const isVideo = isVideoMedia(media);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-white text-left transition-all hover:shadow-md ${
        selected ? 'border-info bg-info/5' : 'border-border hover:border-info/50'
      }`}
      title={getMediaName(media)}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        {src && isVideo ? (
          <video src={src} className="h-full w-full object-cover" muted playsInline />
        ) : src ? (
          <img src={src} alt={getMediaName(media)} className="h-full w-full object-cover" />
        ) : isVideo ? (
          <FileVideo size={40} className="text-purple-500" />
        ) : (
          <ImageIcon size={40} className="text-gray-400" />
        )}
      </div>

      <div
        className={`absolute top-2 right-2 flex h-6 w-6 items-center justify-center shadow-lg ${
          multiple ? 'rounded border-2' : 'rounded-full'
        } ${selected ? 'bg-info border-info' : 'bg-white border-gray-300'}`}
      >
        {selected && <Check size={16} className="text-white" />}
      </div>

      <div className="absolute bottom-0 left-0 right-0 truncate rounded-b bg-black/60 p-2 text-xs text-white">
        {getMediaName(media)}
      </div>
    </button>
  );
};

export const SeoMediaPickerModal = ({
  isOpen,
  onClose,
  onSave,
  selectedItems = [],
  title = 'Chọn media SEO',
  mediaType = 'IMAGE',
  acceptConfig,
  remainingCount = null,
  multiple = true,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const uploadLoading = useSelector(selectSeoUploadLoading);

  const [activeTab, setActiveTab] = useState('library');
  const [mediaItems, setMediaItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [draftSelectedItems, setDraftSelectedItems] = useState([]);

  const selectedCount = draftSelectedItems.length;
  const acceptAttribute = useMemo(
    () => [...acceptConfig.mimeTypes, ...acceptConfig.extensions].join(','),
    [acceptConfig],
  );

  const loadBucketMedia = async (searchValue = search) => {
    setLoading(true);
    setError('');

    try {
      const response = await dispatch(getSeoBucketMediaAsync({
        page: 1,
        limit: 40,
        mediaType,
        search: searchValue || undefined,
        sortBy: 'lastModified',
        sortOrder: 'desc',
      })).unwrap();

      const nextItems = response?.data || [];
      setMediaItems(nextItems.filter((media) => isAcceptedSeoMediaItem(media, acceptConfig)));
      setMeta(response?.meta || null);
    } catch (err) {
      console.error('Load SEO bucket media failed:', err);
      setMediaItems([]);
      setMeta(null);
      setError('Không tải được danh sách media trong bucket SEO.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    setActiveTab('library');
    setSearch('');
    setError('');
    setDraftSelectedItems(selectedItems);
    loadBucketMedia('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mediaType]);

  const toggleMedia = (media) => {
    setError('');
    const mediaKey = getMediaKey(media);
    const isSelected = draftSelectedItems.some((item) => getMediaKey(item) === mediaKey);

    if (isSelected) {
      setDraftSelectedItems((current) => current.filter((item) => getMediaKey(item) !== mediaKey));
      return;
    }

    if (remainingCount !== null && draftSelectedItems.length >= remainingCount) {
      setError(`Slot này chỉ còn được thêm ${remainingCount} media.`);
      return;
    }

    if (!multiple) {
      setDraftSelectedItems([media]);
      return;
    }

    setDraftSelectedItems((current) => [...current, media]);
  };

  const handleUploadFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || uploadLoading) return;

    if (!isAcceptedFile(file, acceptConfig)) {
      setError(`File "${file.name}" không đúng định dạng ${acceptConfig.label}.`);
      return;
    }

    if (remainingCount !== null && draftSelectedItems.length >= remainingCount) {
      setError(`Slot này chỉ còn được thêm ${remainingCount} media.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setError('');

    try {
      const response = await dispatch(uploadSeoMediaAsync(formData)).unwrap();
      const uploadedMedia = response?.data;

      if (!uploadedMedia?.objectKey) {
        setError('Upload thành công nhưng thiếu objectKey từ server.');
        return;
      }

      if (!isAcceptedSeoMediaItem(uploadedMedia, acceptConfig)) {
        setError(`Media vừa upload không đúng định dạng ${acceptConfig.label}.`);
        return;
      }

      setDraftSelectedItems((current) => {
        const uploadedKey = getMediaKey(uploadedMedia);
        if (current.some((media) => getMediaKey(media) === uploadedKey)) return current;
        return multiple ? [...current, uploadedMedia] : [uploadedMedia];
      });
      setActiveTab('library');
      await loadBucketMedia(search);
    } catch (err) {
      console.error('Upload SEO media failed:', err);
      setError('Upload media SEO thất bại. Vui lòng kiểm tra quyền hoặc thử lại.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" showCloseButton={false} customContent>
      <div className="flex h-[85vh] flex-col">
        <div className="mb-2 flex items-center justify-between border-b border-border p-4">
          <h3 className="text-lg font-semibold text-foreground">
            {title} {multiple && '(Chọn nhiều)'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-foreground-light hover:bg-gray-100 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4">
          <Tabs
            tabs={[
              {
                label: 'Thư viện SEO',
                isActive: activeTab === 'library',
                onActivate: () => setActiveTab('library'),
                className: 'bg-primary',
              },
              {
                label: 'Tải lên SEO bucket',
                isActive: activeTab === 'upload',
                onActivate: () => setActiveTab('upload'),
                className: 'bg-primary',
              },
            ]}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'library' ? (
            <div className="flex h-full flex-col p-4">
              <form
                className="mb-4 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  loadBucketMedia(search);
                }}
              >
                <div className="flex-1">
                  <Input
                    name="seoMediaSearch"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Tìm theo tên file trong SEO bucket"
                    disabled={loading}
                  />
                </div>
                <Button type="submit" variant="outline" disabled={loading}>
                  <Search size={16} />
                  Tìm
                </Button>
                <Button type="button" variant="outline" disabled={loading} onClick={() => loadBucketMedia(search)}>
                  <RefreshCw size={16} />
                  Tải lại
                </Button>
              </form>

              {error && (
                <div className="mb-3 rounded-sm bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {loading && mediaItems.length === 0 ? (
                  <div className="flex justify-center py-12">
                    <InlineLoading message="Đang tải media trong bucket SEO..." />
                  </div>
                ) : mediaItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-foreground-light">
                    <ImageIcon className="mb-4 h-16 w-16 text-gray-300" />
                    <p className="text-lg font-medium">Không có media SEO nào</p>
                    <p className="mt-1 text-sm">Hãy tải lên file mới vào SEO bucket.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {mediaItems.map((media) => {
                      const mediaKey = getMediaKey(media);
                      const selected = draftSelectedItems.some((item) => getMediaKey(item) === mediaKey);

                      return (
                        <SeoMediaGridItem
                          key={mediaKey}
                          media={media}
                          selected={selected}
                          multiple={multiple}
                          onClick={() => toggleMedia(media)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={acceptAttribute}
                onChange={handleUploadFile}
              />

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-info/10 text-info">
                <Upload size={28} />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-foreground">Upload vào SEO bucket</h4>
              <p className="mt-2 max-w-md text-sm text-foreground-light">
                File sẽ được tải lên bucket riêng của SEO media, không dùng bucket media chung.
              </p>
              <p className="mt-1 text-xs text-foreground-light">{acceptConfig.label}</p>

              {error && (
                <div className="mt-4 rounded-sm bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}

              <Button
                className="mt-5"
                loading={uploadLoading}
                disabled={uploadLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                Chọn file để upload
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-gray-50 p-4">
          <div className="text-sm text-foreground-light">
            {selectedCount > 0 ? (
              <span className="flex items-center gap-2">
                <Check size={16} className="text-success" />
                Đã chọn {selectedCount} media
              </span>
            ) : (
              'Chưa chọn media nào'
            )}
            {meta?.total !== undefined && activeTab === 'library' && (
              <span className="ml-3 text-xs">Tổng: {meta.total}</span>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button disabled={selectedCount === 0} onClick={() => onSave(draftSelectedItems)}>
              Lưu
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
