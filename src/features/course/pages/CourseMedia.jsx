import { useMemo, useState } from 'react';
import { Image, Images, PlayCircle, Save, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { Button, Dropdown } from '../../../shared/components/ui';
import {
    getCourseByIdAsync,
    selectCourseLoadingUpdate,
    selectCurrentCourse,
    updateCourseMediaAsync,
} from '../store/courseSlice';
import { getCourseMedia, getMediaName, getMediaViewUrl } from '../utils/courseMedia';

const MEDIA_VISIBILITY_OPTIONS = [
    { value: 'PUBLIC', label: 'Public' },
    { value: 'PRIVATE', label: 'Private' },
    { value: 'PROTECTED', label: 'Protected' },
];

const FIELD_CONFIG = {
    thumbnail: {
        label: 'Thumbnail',
        description: 'Ảnh đại diện hiển thị ở danh sách khóa học.',
        type: 'IMAGE',
        multiple: false,
        icon: Image,
    },
    banner: {
        label: 'Banner',
        description: 'Ảnh lớn hiển thị trong trang chi tiết khóa học.',
        type: 'IMAGE',
        multiple: false,
        icon: Images,
    },
    introVideo: {
        label: 'Video giới thiệu',
        description: 'Video ngắn giới thiệu khóa học.',
        type: 'VIDEO',
        multiple: false,
        icon: PlayCircle,
    },
    gallery: {
        label: 'Gallery',
        description: 'Danh sách ảnh bổ sung cho khóa học.',
        type: 'IMAGE',
        multiple: true,
        icon: Images,
    },
};

const asMediaItem = (mediaId, fallback = null) => {
    if (!mediaId) return null;
    if (fallback?.mediaId === mediaId) return fallback;
    return { mediaId };
};

const MediaPreview = ({ media, type = 'IMAGE', compact = false }) => {
    const url = getMediaViewUrl(media);

    if (!media) {
        return (
            <div className="flex h-40 items-center justify-center rounded-sm border border-dashed border-border bg-gray-50 text-sm text-foreground-light">
                Chưa chọn media
            </div>
        );
    }

    return (
        <div className={`overflow-hidden rounded-sm border border-border bg-white ${compact ? 'h-28' : 'h-48'}`}>
            {type === 'VIDEO' ? (
                url ? (
                    <video src={url} controls className="h-full w-full bg-black object-contain" />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-foreground-light">
                        Không có viewUrl
                    </div>
                )
            ) : url ? (
                <img
                    src={url}
                    alt={media.alt || getMediaName(media)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-foreground-light">
                    Không có viewUrl
                </div>
            )}
        </div>
    );
};

const MediaFieldCard = ({ field, value, onPick, onClearGallery }) => {
    const config = FIELD_CONFIG[field];
    const Icon = config.icon;
    const isGallery = field === 'gallery';
    const items = isGallery ? value || [] : value ? [value] : [];

    return (
        <div className="rounded-sm border border-border bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-border p-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-sm bg-gray-100 p-2 text-foreground-light">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">{config.label}</h3>
                        <p className="text-sm text-foreground-light">{config.description}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {isGallery && items.length > 0 && (
                        <Button variant="outline" size="sm" onClick={onClearGallery}>
                            <X className="h-4 w-4" />
                            Xóa gallery
                        </Button>
                    )}
                    <Button size="sm" onClick={onPick}>
                        Chọn media
                    </Button>
                </div>
            </div>

            <div className="p-4">
                {isGallery ? (
                    items.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {items.map((item) => (
                                <div key={item.mediaId} className="space-y-2">
                                    <MediaPreview media={item} compact />
                                    <p className="truncate text-xs text-foreground-light">
                                        #{item.mediaId} · {getMediaName(item)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <MediaPreview media={null} />
                    )
                ) : (
                    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
                        <MediaPreview media={value} type={config.type} />
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-foreground-light">Media ID:</span>{' '}
                                {value?.mediaId || '-'}
                            </p>
                            <p>
                                <span className="text-foreground-light">Tên file:</span>{' '}
                                {value ? getMediaName(value) : '-'}
                            </p>
                            <p>
                                <span className="text-foreground-light">Loại:</span>{' '}
                                {value?.type || config.type}
                            </p>
                            <p>
                                <span className="text-foreground-light">Visibility:</span>{' '}
                                {value?.visibility || '-'}
                            </p>
                            {value?.width && (
                                <p>
                                    <span className="text-foreground-light">Kích thước:</span>{' '}
                                    {value.width} × {value.height}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CourseMedia = () => {
    const dispatch = useDispatch();
    const course = useSelector(selectCurrentCourse);
    const loadingUpdate = useSelector(selectCourseLoadingUpdate);
    const media = useMemo(() => getCourseMedia(course), [course]);
    const [draft, setDraft] = useState({});
    const [visibility, setVisibility] = useState('PUBLIC');
    const [picker, setPicker] = useState(null);

    const currentDraft = {
        thumbnail: draft.thumbnail ?? media.thumbnail,
        banner: draft.banner ?? media.banner,
        introVideo: draft.introVideo ?? media.introVideo,
        gallery: draft.gallery !== undefined ? draft.gallery : media.gallery,
    };

    const openPicker = (field) => setPicker({ field, ...FIELD_CONFIG[field] });

    const handlePickerSave = (selectedIds, selectedItems) => {
        if (!picker) return;

        if (picker.multiple) {
            const ids = Array.isArray(selectedIds) ? selectedIds : [];
            const items = Array.isArray(selectedItems) ? selectedItems : [];
            setDraft((prev) => ({
                ...prev,
                [picker.field]: ids.map((mediaId) =>
                    asMediaItem(mediaId, items.find((item) => item.mediaId === mediaId))
                ).filter(Boolean),
            }));
        } else {
            setDraft((prev) => ({
                ...prev,
                [picker.field]: asMediaItem(selectedIds, selectedItems),
            }));
        }

        setPicker(null);
    };

    const handleSubmit = async () => {
        if (!course?.courseId) return;

        const payload = {
            visibility,
            thumbnailMediaId: currentDraft.thumbnail?.mediaId,
            bannerMediaId: currentDraft.banner?.mediaId,
            introVideoMediaId: currentDraft.introVideo?.mediaId,
            galleryMediaIds: (currentDraft.gallery || []).map((item) => item.mediaId),
        };

        await dispatch(
            updateCourseMediaAsync({
                id: course.courseId,
                data: payload,
            })
        ).unwrap();

        await dispatch(getCourseByIdAsync(course.courseId));
    };

    if (!course) {
        return (
            <div className="rounded-sm border border-border bg-white p-6 text-center text-foreground-light">
                Chưa có dữ liệu khóa học
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-sm border border-border bg-white p-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Media khóa học
                    </h2>
                    <p className="text-sm text-foreground-light">
                        Thumbnail, banner và gallery chỉ nhận IMAGE; video giới thiệu chỉ nhận VIDEO. Media phải READY theo rule backend.
                    </p>
                </div>
                <div className="flex items-end gap-3">
                    <Dropdown
                        label="Visibility"
                        value={visibility}
                        onChange={setVisibility}
                        options={MEDIA_VISIBILITY_OPTIONS}
                        className="w-44"
                    />
                    <Button onClick={handleSubmit} loading={loadingUpdate}>
                        <Save className="h-4 w-4" />
                        Lưu media
                    </Button>
                </div>
            </div>

            <MediaFieldCard
                field="thumbnail"
                value={currentDraft.thumbnail}
                onPick={() => openPicker('thumbnail')}
            />
            <MediaFieldCard
                field="banner"
                value={currentDraft.banner}
                onPick={() => openPicker('banner')}
            />
            <MediaFieldCard
                field="introVideo"
                value={currentDraft.introVideo}
                onPick={() => openPicker('introVideo')}
            />
            <MediaFieldCard
                field="gallery"
                value={currentDraft.gallery}
                onPick={() => openPicker('gallery')}
                onClearGallery={() =>
                    setDraft((prev) => ({ ...prev, gallery: [] }))
                }
            />

            <MediaPickerModal
                isOpen={Boolean(picker)}
                onClose={() => setPicker(null)}
                onSave={handlePickerSave}
                selectedMediaId={
                    picker?.multiple
                        ? (currentDraft[picker?.field] || []).map((item) => item.mediaId)
                        : currentDraft[picker?.field]?.mediaId || null
                }
                title={picker ? `Chọn ${picker.label}` : 'Chọn media'}
                type={picker?.type}
                multiple={picker?.multiple}
            />
        </div>
    );
};
