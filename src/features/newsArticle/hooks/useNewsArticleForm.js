import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { EMPTY_NEWS_CONTENT } from '../constants/newsArticle.constants';
import { createNewsArticleAsync, selectNewsArticleLoadingCreate, selectNewsArticleLoadingUpdate, updateNewsArticleAsync } from '../store/newsArticleSlice';
import { getNewsContentText, newsContentToHtml, sanitizeNewsContentJson, toDateTimeLocal } from '../utils/newsContent.utils';

const DEFAULT_FORM_DATA = {
    auto: true,
    type: 'NEWS',
    title: '',
    excerpt: '',
    thumbnailMediaId: '',
    thumbnailViewUrl: '',
    contentJson: EMPTY_NEWS_CONTENT,
    contentHtml: '',
    contentText: '',
    authorName: '',
    publishedAt: '',
    visibility: 'DRAFT',
    isFeatured: false,
    readingTime: '',
    sortOrder: '0',
    targetKeyword: '',
    keywordText: '',
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    canonicalUrl: '',
    searchIntent: '',
    seoScore: '',
    structuredDataText: '',
};

const optionalText = (value) => value?.trim() || undefined;
const optionalNumber = (value) => (value === '' ? undefined : Number(value));
const nullableText = (value) => value?.trim() || null;
const nullableNumber = (value) => (value === '' ? null : Number(value));

const mapArticleToForm = (article) => ({
    ...DEFAULT_FORM_DATA,
    auto: false,
    type: article.type || 'NEWS',
    title: article.title || '',
    excerpt: article.excerpt || '',
    thumbnailMediaId: article.thumbnailMediaId ?? '',
    thumbnailViewUrl: article.thumbnailViewUrl || '',
    contentJson: article.contentJson || EMPTY_NEWS_CONTENT,
    contentHtml: article.contentHtml || newsContentToHtml(article.contentJson || EMPTY_NEWS_CONTENT),
    contentText: article.contentText || getNewsContentText(article.contentJson),
    authorName: article.authorName || '',
    publishedAt: toDateTimeLocal(article.publishedAt),
    visibility: article.visibility || 'DRAFT',
    isFeatured: Boolean(article.isFeatured),
    readingTime: article.readingTime ?? '',
    sortOrder: article.sortOrder ?? '0',
    targetKeyword: article.targetKeyword || '',
    keywordText: article.keywordText || '',
    metaTitle: article.metaTitle || '',
    metaDescription: article.metaDescription || '',
    ogTitle: article.ogTitle || '',
    ogDescription: article.ogDescription || '',
    canonicalUrl: article.canonicalUrl || '',
    searchIntent: article.searchIntent || '',
    seoScore: article.seoScore ?? '',
    structuredDataText: article.structuredData ? JSON.stringify(article.structuredData, null, 2) : '',
});

export const useNewsArticleForm = ({ mode = 'create', article = null } = {}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loadingCreate = useSelector(selectNewsArticleLoadingCreate);
    const loadingUpdate = useSelector(selectNewsArticleLoadingUpdate);
    const [formData, setFormData] = useState(() => (mode === 'edit' && article ? mapArticleToForm(article) : DEFAULT_FORM_DATA));
    const [errors, setErrors] = useState({});
    const [isThumbnailPickerOpen, setIsThumbnailPickerOpen] = useState(false);
    const loading = mode === 'edit' ? loadingUpdate : loadingCreate;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
        if (errors[name]) setErrors((previous) => ({ ...previous, [name]: '' }));
    };
    const handleToggle = (field, value) => setFormData((previous) => ({ ...previous, [field]: value }));
    const handleContentChange = (content) => {
        setFormData((previous) => ({ ...previous, ...content }));
        if (errors.contentJson) setErrors((previous) => ({ ...previous, contentJson: '' }));
    };
    const saveThumbnail = (mediaId, media) => {
        setFormData((previous) => ({ ...previous, thumbnailMediaId: mediaId || '', thumbnailViewUrl: media?.viewUrl || '' }));
        setIsThumbnailPickerOpen(false);
    };
    const clearThumbnail = () => setFormData((previous) => ({ ...previous, thumbnailMediaId: '', thumbnailViewUrl: '' }));

    const buildPayload = () => {
        const nextErrors = {};
        let structuredData;
        const readingTime = optionalNumber(formData.readingTime);
        const sortOrder = optionalNumber(formData.sortOrder);
        const seoScore = optionalNumber(formData.seoScore);
        const contentText = formData.contentText?.trim() || getNewsContentText(formData.contentJson).trim();

        if (!formData.title.trim()) nextErrors.title = 'Vui lòng nhập tiêu đề bài viết';
        if (!contentText && !(formData.contentJson?.content || []).some((node) => ['image', 'video'].includes(node.type))) nextErrors.contentJson = 'Vui lòng nhập nội dung hoặc chèn media';
        if (readingTime !== undefined && (!Number.isInteger(readingTime) || readingTime < 1)) nextErrors.readingTime = 'Thời gian đọc phải là số nguyên lớn hơn 0';
        if (sortOrder !== undefined && (!Number.isInteger(sortOrder) || sortOrder < 0)) nextErrors.sortOrder = 'Thứ tự hiển thị phải là số nguyên không âm';
        if (seoScore !== undefined && (!Number.isInteger(seoScore) || seoScore < 0 || seoScore > 100)) nextErrors.seoScore = 'Điểm SEO phải từ 0 đến 100';
        if (!formData.auto && formData.structuredDataText.trim()) {
            try {
                structuredData = JSON.parse(formData.structuredDataText);
                if (!structuredData || Array.isArray(structuredData) || typeof structuredData !== 'object') throw new Error();
            } catch {
                nextErrors.structuredDataText = 'Structured data phải là JSON object hợp lệ';
            }
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return null;

        const contentJson = sanitizeNewsContentJson(formData.contentJson || EMPTY_NEWS_CONTENT);
        const basePayload = {
            type: formData.type,
            title: formData.title.trim(),
            excerpt: mode === 'edit' ? nullableText(formData.excerpt) : optionalText(formData.excerpt),
            thumbnailMediaId: formData.thumbnailMediaId === '' ? (mode === 'edit' ? null : undefined) : Number(formData.thumbnailMediaId),
            contentJson,
            contentHtml: newsContentToHtml(contentJson),
            contentText,
            authorName: mode === 'edit' ? nullableText(formData.authorName) : optionalText(formData.authorName),
            publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : (mode === 'edit' ? null : undefined),
            visibility: formData.visibility,
            isFeatured: formData.isFeatured,
            readingTime: mode === 'edit' ? nullableNumber(formData.readingTime) : readingTime,
            sortOrder: sortOrder ?? 0,
        };

        if (mode === 'create') {
            basePayload.auto = formData.auto;
            if (!formData.auto) Object.assign(basePayload, {
                targetKeyword: optionalText(formData.targetKeyword), keywordText: optionalText(formData.keywordText), metaTitle: optionalText(formData.metaTitle), metaDescription: optionalText(formData.metaDescription), ogTitle: optionalText(formData.ogTitle), ogDescription: optionalText(formData.ogDescription), canonicalUrl: optionalText(formData.canonicalUrl), searchIntent: optionalText(formData.searchIntent), seoScore, structuredData,
            });
        } else {
            Object.assign(basePayload, {
                targetKeyword: nullableText(formData.targetKeyword), keywordText: nullableText(formData.keywordText), metaTitle: nullableText(formData.metaTitle), metaDescription: nullableText(formData.metaDescription), ogTitle: nullableText(formData.ogTitle), ogDescription: nullableText(formData.ogDescription), canonicalUrl: nullableText(formData.canonicalUrl), searchIntent: nullableText(formData.searchIntent), seoScore: nullableNumber(formData.seoScore), structuredData: formData.structuredDataText.trim() ? structuredData : null,
            });
        }
        return basePayload;
    };

    const submit = async (event) => {
        event.preventDefault();
        const payload = buildPayload();
        if (!payload) return;
        const response = mode === 'edit'
            ? await dispatch(updateNewsArticleAsync({ id: article.newsArticleId, data: payload })).unwrap()
            : await dispatch(createNewsArticleAsync(payload)).unwrap();
        const newsArticleId = response?.data?.newsArticleId;
        navigate(newsArticleId ? ROUTES.NEWS_ARTICLE_DETAIL(newsArticleId) : ROUTES.NEWS_ARTICLES);
    };

    return { formData, errors, loading, isThumbnailPickerOpen, handleChange, handleToggle, handleContentChange, openThumbnailPicker: () => setIsThumbnailPickerOpen(true), closeThumbnailPicker: () => setIsThumbnailPickerOpen(false), saveThumbnail, clearThumbnail, submit };
};
