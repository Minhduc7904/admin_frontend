import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import {
    createDocumentAsync,
    selectDocumentLoadingCreate,
    selectDocumentLoadingUpdate,
    updateDocumentAsync,
} from '../store/documentSlice';

const DEFAULT_FORM_DATA = {
    title: '',
    mediaId: '',
    autoThumbnail: true,
    thumbnailMediaId: '',
    autoContent: true,
    contentStartPage: '',
    contentEndPage: '',
    shortDescription: '',
    content: '',
    sourceName: '',
    sourceUrl: '',
    autoSeo: true,
    targetKeyword: '',
    keywordText: '',
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    searchIntent: '',
    visibility: 'DRAFT',
    isFeatured: false,
    readingTime: '',
    tags: [],
};

const toOptionalText = (value) => value.trim() || undefined;
const toOptionalNumber = (value) => (value === '' ? undefined : Number(value));

const buildPayload = (formData, mode) => ({
    title: formData.title.trim(),
    mediaId: mode === 'create' ? Number(formData.mediaId) : undefined,
    thumbnailMediaId: formData.autoThumbnail ? undefined : toOptionalNumber(formData.thumbnailMediaId),
    contentStartPage: toOptionalNumber(formData.contentStartPage),
    contentEndPage: toOptionalNumber(formData.contentEndPage),
    shortDescription: toOptionalText(formData.shortDescription),
    content: formData.autoContent ? undefined : toOptionalText(formData.content),
    sourceName: toOptionalText(formData.sourceName),
    sourceUrl: toOptionalText(formData.sourceUrl),
    targetKeyword: formData.autoSeo ? undefined : toOptionalText(formData.targetKeyword),
    keywordText: formData.autoSeo ? undefined : toOptionalText(formData.keywordText),
    metaTitle: formData.autoSeo ? undefined : toOptionalText(formData.metaTitle),
    metaDescription: formData.autoSeo ? undefined : toOptionalText(formData.metaDescription),
    ogTitle: formData.autoSeo ? undefined : toOptionalText(formData.ogTitle),
    ogDescription: formData.autoSeo ? undefined : toOptionalText(formData.ogDescription),
    searchIntent: formData.autoSeo ? undefined : toOptionalText(formData.searchIntent),
    visibility: formData.visibility,
    isFeatured: formData.isFeatured,
    readingTime: toOptionalNumber(formData.readingTime),
    tagIds: formData.tags.map((tag) => tag.tagId),
});

const getUsageMediaId = (document, fieldName) =>
    document?.mediaUsages?.find((usage) => usage.fieldName === fieldName)?.mediaId || '';

const hasSeoData = (document) =>
    [
        document?.targetKeyword,
        document?.keywordText,
        document?.metaTitle,
        document?.metaDescription,
        document?.ogTitle,
        document?.ogDescription,
        document?.searchIntent,
    ].some(Boolean);

const mapDocumentToFormData = (document) => {
    const content = document?.processedContent || document?.content || '';
    const thumbnailMediaId = getUsageMediaId(document, 'documentThumbnail');

    return {
        ...DEFAULT_FORM_DATA,
        title: document?.title || '',
        mediaId: getUsageMediaId(document, 'documentFile'),
        autoThumbnail: !thumbnailMediaId,
        thumbnailMediaId,
        autoContent: !content,
        shortDescription: document?.shortDescription || '',
        content,
        sourceName: document?.sourceName || '',
        sourceUrl: document?.sourceUrl || '',
        autoSeo: !hasSeoData(document),
        targetKeyword: document?.targetKeyword || '',
        keywordText: document?.keywordText || '',
        metaTitle: document?.metaTitle || '',
        metaDescription: document?.metaDescription || '',
        ogTitle: document?.ogTitle || '',
        ogDescription: document?.ogDescription || '',
        searchIntent: document?.searchIntent || '',
        visibility: document?.visibility || 'DRAFT',
        isFeatured: Boolean(document?.isFeatured),
        readingTime: document?.readingTime ?? '',
        tags: document?.tags || [],
    };
};

const validateForm = (formData, mode) => {
    const errors = {};
    const tagsByType = formData.tags.reduce((acc, tag) => {
        acc[tag.type] = [...(acc[tag.type] || []), tag];
        return acc;
    }, {});

    if (!formData.title.trim()) {
        errors.title = 'Tiêu đề không được để trống';
    }
    if (mode === 'create' && !formData.mediaId) {
        errors.mediaId = 'Vui lòng chọn file PDF';
    }
    if (formData.autoContent) {
        if (!formData.contentStartPage) {
            errors.contentStartPage = 'Vui lòng nhập trang bắt đầu OCR';
        }
        if (!formData.contentEndPage) {
            errors.contentEndPage = 'Vui lòng nhập trang kết thúc OCR';
        }
        if (
            formData.contentStartPage &&
            formData.contentEndPage &&
            Number(formData.contentStartPage) > Number(formData.contentEndPage)
        ) {
            errors.contentEndPage = 'Trang kết thúc phải lớn hơn hoặc bằng trang bắt đầu';
        }
    } else if (!formData.content.trim()) {
        errors.content = 'Vui lòng nhập nội dung hoặc bật chế độ tự động';
    }
    if (!formData.autoSeo) {
        [
            ['targetKeyword', 'Từ khóa mục tiêu'],
            ['keywordText', 'Keyword text'],
            ['metaTitle', 'Meta title'],
            ['metaDescription', 'Meta description'],
            ['ogTitle', 'OG title'],
            ['ogDescription', 'OG description'],
            ['searchIntent', 'Search intent'],
        ].forEach(([field, label]) => {
            if (!formData[field].trim()) {
                errors[field] = `${label} không được để trống`;
            }
        });
    }
    if (formData.readingTime !== '' && Number(formData.readingTime) < 0) {
        errors.readingTime = 'Thời gian đọc không được âm';
    }

    if ((tagsByType.LEVEL || []).length !== 1) {
        errors.levelTag = 'Vui lòng chọn đúng 1 tag cấp học';
    }
    if ((tagsByType.SUBJECT || []).length !== 1) {
        errors.subjectTag = 'Vui lòng chọn đúng 1 tag môn học';
    }
    if ((tagsByType.DOCUMENT_TYPE || []).length < 1) {
        errors.documentTypeTags = 'Vui lòng chọn ít nhất 1 tag loại tài liệu';
    }

    return errors;
};

export const useDocumentForm = ({ mode = 'create', document = null } = {}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loadingCreate = useSelector(selectDocumentLoadingCreate);
    const loadingUpdate = useSelector(selectDocumentLoadingUpdate);
    const loading = mode === 'edit' ? loadingUpdate : loadingCreate;
    const [formData, setFormData] = useState(() =>
        mode === 'edit' && document ? mapDocumentToFormData(document) : DEFAULT_FORM_DATA
    );
    const [errors, setErrors] = useState({});
    const [pickerState, setPickerState] = useState({
        isOpen: false,
        field: null,
        type: null,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleMarkdownChange = (content) => {
        setFormData((prev) => ({ ...prev, content }));
    };

    const handleSwitchChange = (checked) => {
        setFormData((prev) => ({ ...prev, isFeatured: checked }));
    };

    const handleModeSwitchChange = (field, checked) => {
        setFormData((prev) => ({ ...prev, [field]: checked }));
        setErrors((prev) => {
            const next = { ...prev };
            if (field === 'autoContent') {
                delete next.content;
                delete next.contentStartPage;
                delete next.contentEndPage;
            }
            if (field === 'autoSeo') {
                [
                    'targetKeyword',
                    'keywordText',
                    'metaTitle',
                    'metaDescription',
                    'ogTitle',
                    'ogDescription',
                    'searchIntent',
                ].forEach((key) => delete next[key]);
            }
            if (field === 'autoThumbnail') {
                delete next.thumbnailMediaId;
            }
            return next;
        });
    };

    const handleTagChange = (type, nextValue) => {
        setFormData((prev) => {
            const tagsWithoutType = prev.tags.filter((tag) => tag.type !== type);
            const nextTags = Array.isArray(nextValue)
                ? [...tagsWithoutType, ...nextValue]
                : nextValue
                    ? [...tagsWithoutType, nextValue]
                    : tagsWithoutType;

            return { ...prev, tags: nextTags };
        });
        setErrors((prev) => {
            const next = { ...prev };
            if (type === 'LEVEL') delete next.levelTag;
            if (type === 'SUBJECT') delete next.subjectTag;
            if (type === 'DOCUMENT_TYPE') delete next.documentTypeTags;
            return next;
        });
    };

    const openMediaPicker = (field, type) => {
        setPickerState({ isOpen: true, field, type });
    };

    const closeMediaPicker = () => {
        setPickerState({ isOpen: false, field: null, type: null });
    };

    const saveMedia = (mediaId) => {
        if (!pickerState.field) return;
        setFormData((prev) => ({ ...prev, [pickerState.field]: mediaId || '' }));
        if (errors[pickerState.field]) {
            setErrors((prev) => ({ ...prev, [pickerState.field]: '' }));
        }
        closeMediaPicker();
    };

    const clearMedia = (field) => {
        setFormData((prev) => ({ ...prev, [field]: '' }));
    };

    const submit = async (e) => {
        e.preventDefault();
        const nextErrors = validateForm(formData, mode);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        const payload = buildPayload(formData, mode);
        const response =
            mode === 'edit'
                ? await dispatch(
                    updateDocumentAsync({
                        id: document.documentId,
                        data: payload,
                    })
                ).unwrap()
                : await dispatch(createDocumentAsync(payload)).unwrap();
        const documentId = response?.data?.documentId;
        navigate(documentId ? ROUTES.DOCUMENT_DETAIL(documentId) : ROUTES.DOCUMENTS);
    };

    return {
        formData,
        errors,
        loading,
        pickerState,
        handleChange,
        handleMarkdownChange,
        handleSwitchChange,
        handleModeSwitchChange,
        handleTagChange,
        openMediaPicker,
        closeMediaPicker,
        saveMedia,
        clearMedia,
        submit,
    };
};
