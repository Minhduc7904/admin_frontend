import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ImagePlus, Save, Sparkles, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { bookApi } from '../../../core/api';
import { ROUTES } from '../../../core/constants';
import { Button, Checkbox, Input, Select, Textarea } from '../../../shared/components/ui';
import { InlineLoading } from '../../../shared/components';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { addNotification } from '../../notification/store/notificationSlice';

const visibilityOptions = [{ value: 'DRAFT', label: 'Nháp' }, { value: 'PRIVATE', label: 'Riêng tư' }, { value: 'PUBLISHED', label: 'Đã xuất bản' }];
const blankForm = {
  sku: '', isbn: '', title: '', slug: '', shortDescription: '', content: '', author: '', publisher: '', priceVnd: '', categoryIds: [], visibility: 'DRAFT', isFeatured: false, autoGenerateSeo: true,
  targetKeyword: '', keywordText: '', metaTitle: '', metaDescription: '', ogTitle: '', ogDescription: '', canonicalUrl: '', searchIntent: '', seoScore: '', structuredDataText: '',
  coverMediaId: null, ogImageMediaId: null, galleryMediaIds: [],
};
const getData = (response) => response?.data?.data ?? response?.data ?? response;
const fieldId = (media, fieldName) => media?.find((item) => item.fieldName?.toLowerCase() === fieldName)?.mediaId ?? null;
const optionalString = (value) => value.trim() || undefined;

const mapBookToForm = (book) => ({
  ...blankForm,
  sku: book.sku || '', isbn: book.isbn || '', title: book.title || '', slug: book.slug || '', shortDescription: book.shortDescription || '', content: book.content || '', author: book.author || '', publisher: book.publisher || '', priceVnd: String(book.priceVnd || ''),
  categoryIds: book.categories?.map((category) => category.bookCategoryId) || [], visibility: book.visibility || 'DRAFT', isFeatured: Boolean(book.isFeatured),
  targetKeyword: book.targetKeyword || '', keywordText: book.keywordText || '', metaTitle: book.metaTitle || '', metaDescription: book.metaDescription || '', ogTitle: book.ogTitle || '', ogDescription: book.ogDescription || '', canonicalUrl: book.canonicalUrl || '', searchIntent: book.searchIntent || '', seoScore: book.seoScore === null || book.seoScore === undefined ? '' : String(book.seoScore),
  structuredDataText: book.structuredData ? JSON.stringify(book.structuredData, null, 2) : '', coverMediaId: fieldId(book.media, 'cover'), ogImageMediaId: fieldId(book.media, 'og_image'), galleryMediaIds: book.media?.filter((item) => item.fieldName?.toLowerCase() === 'gallery').map((item) => item.mediaId) || [],
});

export const BookEditorPage = ({ mode }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(blankForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [picker, setPicker] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesResponse, bookResponse] = await Promise.all([
        bookApi.getCategories(),
        mode === 'edit' ? bookApi.getById(id) : Promise.resolve(null),
      ]);
      setCategories(getData(categoriesResponse) || []);
      if (bookResponse) setForm(mapBookToForm(getData(bookResponse)));
    } catch (requestError) {
      setError(requestError?.data?.message || requestError?.message || 'Không thể tải dữ liệu sách.');
    } finally {
      setLoading(false);
    }
  }, [id, mode]);

  useEffect(() => { load(); }, [load]);

  const setValue = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const toggleCategory = (categoryId, checked) => setForm((current) => ({ ...current, categoryIds: checked ? [...current.categoryIds, categoryId] : current.categoryIds.filter((idValue) => idValue !== categoryId) }));
  const pickerTitle = useMemo(() => ({ cover: 'Chọn ảnh bìa sách', og: 'Chọn ảnh OG', gallery: 'Chọn ảnh gallery' }[picker]), [picker]);

  const save = async (event) => {
    event.preventDefault();
    if (!form.sku.trim() || !form.title.trim() || Number(form.priceVnd) < 1 || form.categoryIds.length === 0) {
      setError('SKU, tên sách, giá bán và ít nhất một loại sách là bắt buộc.');
      return;
    }
    let structuredData;
    try { structuredData = form.structuredDataText.trim() ? JSON.parse(form.structuredDataText) : undefined; } catch { setError('Dữ liệu JSON-LD chưa hợp lệ.'); return; }
    setSaving(true);
    setError('');
    const payload = {
      sku: form.sku.trim(), title: form.title.trim(), priceVnd: Number(form.priceVnd), categoryIds: form.categoryIds, visibility: form.visibility, isFeatured: form.isFeatured,
      isbn: optionalString(form.isbn), slug: optionalString(form.slug), shortDescription: optionalString(form.shortDescription), content: optionalString(form.content), author: optionalString(form.author), publisher: optionalString(form.publisher),
      targetKeyword: optionalString(form.targetKeyword), keywordText: optionalString(form.keywordText), metaTitle: optionalString(form.metaTitle), metaDescription: optionalString(form.metaDescription), ogTitle: optionalString(form.ogTitle), ogDescription: optionalString(form.ogDescription), canonicalUrl: optionalString(form.canonicalUrl), searchIntent: optionalString(form.searchIntent),
      autoGenerateSeo: mode === 'create' ? form.autoGenerateSeo : undefined,
      seoScore: form.seoScore === '' ? undefined : Number(form.seoScore), structuredData,
      coverMediaId: form.coverMediaId, ogImageMediaId: form.ogImageMediaId, galleryMediaIds: form.galleryMediaIds,
    };
    try {
      const response = mode === 'edit' ? await bookApi.update(id, payload) : await bookApi.create(payload);
      const saved = getData(response);
      dispatch(addNotification({ type: 'success', title: mode === 'edit' ? 'Đã cập nhật sách' : 'Đã tạo sách', message: 'Thông tin catalog và media đã được lưu.', autoHide: true }));
      navigate(ROUTES.BOOK_EDIT(saved.bookId));
    } catch (requestError) {
      setError(requestError?.data?.message || requestError?.message || 'Không thể lưu sách.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <InlineLoading message="Đang tải dữ liệu sách..." />;
  return <form onSubmit={save} className="space-y-6 p-4 md:p-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><Button variant="ghost" onClick={() => navigate(ROUTES.BOOKS)}><ArrowLeft className="h-4 w-4" /> Danh sách sách</Button><h1 className="mt-3 text-2xl font-semibold text-foreground">{mode === 'edit' ? 'Chỉnh sửa sách' : 'Tạo sách nháp'}</h1><p className="mt-1 text-sm text-foreground-light">Chỉ chuyển sang xuất bản khi hotline và Facebook bán sách đã được cấu hình.</p></div><Button type="submit" loading={saving}><Save className="h-4 w-4" /> {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo sách'}</Button></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
    <section className="rounded-xl border border-border bg-white p-5"><h2 className="font-semibold text-foreground">Thông tin cơ bản</h2><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Input label="SKU" name="sku" value={form.sku} onChange={(event) => setValue('sku', event.target.value)} required placeholder="VD: BOOK-ATOMIC-HABITS" /><Input label="ISBN" name="isbn" value={form.isbn} onChange={(event) => setValue('isbn', event.target.value)} placeholder="VD: 978-0-7352-1129-2" /><Input label="Slug" name="slug" value={form.slug} onChange={(event) => setValue('slug', event.target.value)} helperText="Để trống để backend tự tạo từ tên sách." placeholder="VD: atomic-habits" /><Input label="Tên sách" name="title" value={form.title} onChange={(event) => setValue('title', event.target.value)} required className="xl:col-span-2" placeholder="VD: Atomic Habits" /><Input label="Giá bán (VND)" name="priceVnd" type="number" min="1" value={form.priceVnd} onChange={(event) => setValue('priceVnd', event.target.value)} required placeholder="VD: 199000" /><Input label="Tác giả" name="author" value={form.author} onChange={(event) => setValue('author', event.target.value)} placeholder="VD: James Clear" /><Input label="Nhà xuất bản" name="publisher" value={form.publisher} onChange={(event) => setValue('publisher', event.target.value)} placeholder="VD: BEE Books" /><Select label="Trạng thái hiển thị" name="visibility" value={form.visibility} onChange={(event) => setValue('visibility', event.target.value)} options={visibilityOptions} /></div><div className="mt-4"><Textarea label="Mô tả ngắn" name="shortDescription" value={form.shortDescription} onChange={(event) => setValue('shortDescription', event.target.value)} rows={3} maxLength={500} placeholder="VD: Cuốn sách giúp xây dựng thói quen tốt bằng những thay đổi nhỏ mỗi ngày." /></div><div className="mt-4"><Textarea label="Nội dung chi tiết (HTML)" name="content" value={form.content} onChange={(event) => setValue('content', event.target.value)} rows={10} maxLength={100000} placeholder="VD: <h2>Giới thiệu sách</h2><p>Nội dung chi tiết về cuốn sách...</p>" /></div><div className="mt-4"><Checkbox id="book-featured" checked={form.isFeatured} onChange={(checked) => setValue('isFeatured', checked)} label="Đánh dấu sách nổi bật" /></div></section>
    <section className="rounded-xl border border-border bg-white p-5"><h2 className="font-semibold text-foreground">Loại sách</h2><p className="mt-1 text-sm text-foreground-light">Chỉ có thể gắn loại sách đang hoạt động.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <Checkbox key={category.bookCategoryId} id={`category-${category.bookCategoryId}`} checked={form.categoryIds.includes(category.bookCategoryId)} onChange={(checked) => toggleCategory(category.bookCategoryId, checked)} label={<span>{category.name}{!category.isActive && <span className="ml-1 text-red-600">(đang ngừng)</span>}</span>} />)}</div></section>
    <section className="rounded-xl border border-border bg-white p-5"><h2 className="font-semibold text-foreground">Media</h2><p className="mt-1 text-sm text-foreground-light">Media phải ở trạng thái sẵn sàng. URL ảnh chỉ được dùng để xem và sẽ hết hạn.</p><div className="mt-4 grid gap-4 md:grid-cols-3"><MediaField label="Ảnh bìa" value={form.coverMediaId} onSelect={() => setPicker('cover')} onClear={() => setValue('coverMediaId', null)} /><MediaField label="Ảnh OG" value={form.ogImageMediaId} onSelect={() => setPicker('og')} onClear={() => setValue('ogImageMediaId', null)} /><MediaField label="Gallery" value={form.galleryMediaIds} onSelect={() => setPicker('gallery')} onClear={() => setValue('galleryMediaIds', [])} multiple /></div></section>
    <section className="rounded-xl border border-border bg-white p-5"><h2 className="font-semibold text-foreground">SEO</h2>{mode === 'create' && <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-4"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 text-violet-700" /><div className="flex-1"><p className="font-medium text-violet-950">Tự động tạo SEO bằng AI</p><p className="mt-1 text-sm text-violet-800">AI sẽ sinh từ khóa, meta/OG title và description, search intent, điểm SEO và JSON-LD từ thông tin sách. Sau khi tạo, bạn vẫn có thể chỉnh sửa các trường này.</p><div className="mt-3"><Checkbox id="book-auto-generate-seo" checked={form.autoGenerateSeo} onChange={(checked) => setValue('autoGenerateSeo', checked)} label="Dùng AI để tạo SEO cho sách này" /></div></div></div></div>}{!(mode === 'create' && form.autoGenerateSeo) && <><div className="mt-4 grid gap-4 md:grid-cols-2"><Input label="Từ khóa chính" name="targetKeyword" value={form.targetKeyword} onChange={(event) => setValue('targetKeyword', event.target.value)} placeholder="VD: sách xây dựng thói quen" /><Input label="Danh sách từ khóa" name="keywordText" value={form.keywordText} onChange={(event) => setValue('keywordText', event.target.value)} placeholder="VD: thói quen tốt, phát triển bản thân" /><Input label="Meta title" name="metaTitle" value={form.metaTitle} onChange={(event) => setValue('metaTitle', event.target.value)} placeholder="VD: Atomic Habits | Nhà sách BEE" /><Input label="OG title" name="ogTitle" value={form.ogTitle} onChange={(event) => setValue('ogTitle', event.target.value)} placeholder="VD: Atomic Habits - Thay đổi nhỏ, kết quả lớn" /><Input label="Canonical URL" name="canonicalUrl" value={form.canonicalUrl} onChange={(event) => setValue('canonicalUrl', event.target.value)} placeholder="VD: https://bee.edu.vn/sach/atomic-habits" /><Input label="Search intent" name="searchIntent" value={form.searchIntent} onChange={(event) => setValue('searchIntent', event.target.value)} placeholder="VD: Informational" /><Input label="Điểm SEO" name="seoScore" type="number" min="0" max="100" value={form.seoScore} onChange={(event) => setValue('seoScore', event.target.value)} placeholder="VD: 85" /><div /></div><div className="mt-4 grid gap-4 md:grid-cols-2"><Textarea label="Meta description" name="metaDescription" value={form.metaDescription} onChange={(event) => setValue('metaDescription', event.target.value)} rows={3} maxLength={500} placeholder="VD: Khám phá Atomic Habits, cuốn sách giúp bạn xây dựng thói quen tốt mỗi ngày." /><Textarea label="OG description" name="ogDescription" value={form.ogDescription} onChange={(event) => setValue('ogDescription', event.target.value)} rows={3} maxLength={500} placeholder="VD: Đặt mua Atomic Habits và bắt đầu hành trình thay đổi từ những thói quen nhỏ." /></div><div className="mt-4"><Textarea label="Structured data (JSON-LD)" name="structuredData" value={form.structuredDataText} onChange={(event) => setValue('structuredDataText', event.target.value)} rows={7} maxLength={50000} placeholder='{ "@context": "https://schema.org", "@type": "Book" }' /></div></>}</section>
    <div className="flex justify-end"><Button type="submit" loading={saving}><Save className="h-4 w-4" /> {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo sách'}</Button></div>
    <MediaPickerModal isOpen={Boolean(picker)} onClose={() => setPicker(null)} onSave={(value) => { if (picker === 'gallery') setValue('galleryMediaIds', value); else setValue(picker === 'cover' ? 'coverMediaId' : 'ogImageMediaId', value); setPicker(null); }} selectedMediaId={picker === 'gallery' ? form.galleryMediaIds : picker === 'cover' ? form.coverMediaId : form.ogImageMediaId} title={pickerTitle} type="IMAGE" multiple={picker === 'gallery'} />
  </form>;
};

const MediaField = ({ label, value, onSelect, onClear, multiple = false }) => <div className="rounded-lg border border-border p-4"><p className="text-sm font-medium text-foreground">{label}</p><p className="mt-1 text-xs text-foreground-light">{multiple ? value.length ? `Đã chọn ${value.length} ảnh` : 'Chưa chọn ảnh' : value ? `Media #${value}` : 'Chưa chọn ảnh'}</p><div className="mt-3 flex gap-2"><Button size="sm" variant="outline" onClick={onSelect}><ImagePlus className="h-4 w-4" /> Chọn</Button>{(multiple ? value.length > 0 : value) && <Button size="sm" variant="ghost" onClick={onClear}><Trash2 className="h-4 w-4" /> Bỏ</Button>}</div></div>;
