import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SEO_MEDIA_PAGES, getSeoPageByPageKey } from '../constants/seoMedia.constant';
import { SeoSlotDeleteModal, SeoSlotForm, SeoSlotToolbar, SeoSlotTree } from '../components/seoSlot';
import {
  createSlotAsync,
  deleteSlotAsync,
  getSlotsAsync,
  selectSeoLoading,
  selectSeoSlotsByPageKey,
  updateSlotAsync,
} from '../store/seoMediaSlice';

const EMPTY_FORM = {
  code: '',
  name: '',
  pageKey: SEO_MEDIA_PAGES[0].pageKey,
  type: 'image',
  description: '',
  isActive: true,
  minItems: 0,
  maxItems: '',
  recommendedWidth: '',
  recommendedHeight: '',
};

const buildFormDataFromSlot = (slot) => ({
  code: slot?.code || '',
  name: slot?.name || '',
  pageKey: slot?.pageKey || SEO_MEDIA_PAGES[0].pageKey,
  type: slot?.type || 'image',
  description: slot?.description || '',
  isActive: slot?.isActive ?? true,
  minItems: slot?.minItems ?? 0,
  maxItems: slot?.maxItems ?? '',
  recommendedWidth: slot?.recommendedWidth ?? '',
  recommendedHeight: slot?.recommendedHeight ?? '',
});

const toOptionalNumber = (value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  return Number(value);
};

export const SeoSlotPage = () => {
  const dispatch = useDispatch();
  const slotsByPageKey = useSelector(selectSeoSlotsByPageKey);
  const loading = useSelector(selectSeoLoading);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPageKey, setSelectedPageKey] = useState(SEO_MEDIA_PAGES[0].pageKey);
  const [expandedPageKeys, setExpandedPageKeys] = useState([SEO_MEDIA_PAGES[0].pageKey]);
  const [loadedPageKeys, setLoadedPageKeys] = useState([]);
  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    code: `${SEO_MEDIA_PAGES[0].pageKey}_`,
  });
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const selectedPage = getSeoPageByPageKey(selectedPageKey) || SEO_MEDIA_PAGES[0];

  const loadSlotsByPage = (pageKey, force = false) => {
    if (!force && loadedPageKeys.includes(pageKey)) return;

    dispatch(getSlotsAsync({ page: 1, limit: 100, includeItems: true, pageKey }));
    setLoadedPageKeys((prev) => (prev.includes(pageKey) ? prev : [...prev, pageKey]));
  };

  useEffect(() => {
    loadSlotsByPage(SEO_MEDIA_PAGES[0].pageKey, true);
  }, [dispatch]);

  const slotsByPage = useMemo(() => {
    return SEO_MEDIA_PAGES.map((page) => ({
      ...page,
      slots: slotsByPageKey[page.pageKey] || [],
    }));
  }, [slotsByPageKey]);

  const handleTogglePage = (page) => {
    setExpandedPageKeys((prev) =>
      prev.includes(page.pageKey)
        ? prev.filter((key) => key !== page.pageKey)
        : [...prev, page.pageKey]
    );
    loadSlotsByPage(page.pageKey);
  };

  const handleSelectPage = (page) => {
    setSelectedPageKey(page.pageKey);
    setExpandedPageKeys((prev) => (prev.includes(page.pageKey) ? prev : [...prev, page.pageKey]));
    loadSlotsByPage(page.pageKey);
  };

  const handleSelectSlot = (slot) => {
    const page = getSeoPageByPageKey(slot.pageKey);

    setSelectedSlot(slot);
    setSelectedPageKey(page?.pageKey || SEO_MEDIA_PAGES[0].pageKey);
    setFormData(buildFormDataFromSlot(slot));
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'pageKey') {
      setSelectedPageKey(value);
      loadSlotsByPage(value);
    }

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreateDraft = (page) => {
    setSelectedSlot(null);
    setSelectedPageKey(page.pageKey);
    setExpandedPageKeys((prev) => (prev.includes(page.pageKey) ? prev : [...prev, page.pageKey]));
    loadSlotsByPage(page.pageKey);
    setFormData({
      ...EMPTY_FORM,
      pageKey: page.pageKey,
      code: `${page.pageKey}_`,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    const code = formData.code.trim();
    const name = formData.name.trim();

    if (!code) {
      errors.code = 'Mã slot không được để trống';
    } else if (!/^[a-z0-9_]+$/.test(code)) {
      errors.code = 'Mã slot chỉ dùng chữ thường, số và dấu gạch dưới';
    }

    if (!name) {
      errors.name = 'Tên slot không được để trống';
    }

    if (!formData.pageKey) {
      errors.pageKey = 'Vui lòng chọn page';
    }

    if (Number(formData.minItems) < 0) {
      errors.minItems = 'Số lượng tối thiểu không được âm';
    }

    if (formData.maxItems !== '' && Number(formData.maxItems) < Number(formData.minItems || 0)) {
      errors.maxItems = 'Số lượng tối đa phải lớn hơn hoặc bằng tối thiểu';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      pageKey: formData.pageKey,
      type: formData.type,
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
      minItems: Number(formData.minItems || 0),
      maxItems: toOptionalNumber(formData.maxItems),
      recommendedWidth: toOptionalNumber(formData.recommendedWidth),
      recommendedHeight: toOptionalNumber(formData.recommendedHeight),
    };

    try {
      if (selectedSlot?.slotId) {
        const updated = await dispatch(updateSlotAsync({ slotId: selectedSlot.slotId, data: payload })).unwrap();
        if (updated?.data) {
          setSelectedSlot(updated.data);
          setFormData(buildFormDataFromSlot(updated.data));
        }
      } else {
        const created = await dispatch(createSlotAsync(payload)).unwrap();
        if (created?.data) {
          setSelectedSlot(created.data);
          setFormData(buildFormDataFromSlot(created.data));
        }
      }
    } catch (error) {
      console.error('Save SEO slot failed:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.slotId) return;

    try {
      await dispatch(deleteSlotAsync(deleteTarget.slotId)).unwrap();
      setDeleteTarget(null);

      if (selectedSlot?.slotId === deleteTarget.slotId) {
        setSelectedSlot(null);
        setFormData({
          ...EMPTY_FORM,
          pageKey: selectedPage.pageKey,
          code: `${selectedPage.pageKey}_`,
        });
      }
    } catch (error) {
      console.error('Delete SEO slot failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <SeoSlotToolbar
        loading={loading}
        selectedPage={selectedPage}
        onReload={loadSlotsByPage}
        onCreateDraft={handleCreateDraft}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <SeoSlotTree
          loading={loading}
          pages={slotsByPage}
          expandedPageKeys={expandedPageKeys}
          selectedPageKey={selectedPageKey}
          selectedSlot={selectedSlot}
          onTogglePage={handleTogglePage}
          onSelectPage={handleSelectPage}
          onSelectSlot={handleSelectSlot}
          onCreateDraft={handleCreateDraft}
        />

        <SeoSlotForm
          formData={formData}
          formErrors={formErrors}
          loading={loading}
          selectedPage={selectedPage}
          selectedSlot={selectedSlot}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCreateDraft={handleCreateDraft}
          onDelete={setDeleteTarget}
        />
      </div>

      <SeoSlotDeleteModal
        deleteTarget={deleteTarget}
        loading={loading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
