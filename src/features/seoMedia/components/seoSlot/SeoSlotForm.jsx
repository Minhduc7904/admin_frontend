import { Edit2, Save, Trash2 } from 'lucide-react';
import { Button, Input, Select, Textarea } from '../../../../shared/components/ui';
import { SEO_MEDIA_PAGES, SLOT_TYPE_OPTIONS } from '../../constants/seoMedia.constant';

export const SeoSlotForm = ({
  formData,
  formErrors,
  loading,
  selectedPage,
  selectedSlot,
  onChange,
  onSubmit,
  onCreateDraft,
  onDelete,
}) => {
  return (
    <section className="xl:col-span-7 bg-white border border-border rounded-sm">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {selectedSlot ? 'Chỉnh sửa slot' : 'Tạo slot mới'}
          </h2>
          <p className="text-xs text-foreground-light mt-1">
            Page: {selectedPage.name} - pageKey: {selectedPage.pageKey}
          </p>
        </div>
        {selectedSlot && (
          <Button variant="outline" size="sm" onClick={() => onDelete(selectedSlot)}>
            <Trash2 size={14} />
            Xóa
          </Button>
        )}
      </div>

      <form onSubmit={onSubmit} className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mã slot"
            name="code"
            value={formData.code}
            onChange={onChange}
            placeholder={`${selectedPage.pageKey}_hero`}
            helperText="Code là mã duy nhất của slot, không dùng để nhóm page."
            error={formErrors.code}
          />
          <Input
            label="Tên slot"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Banner chính"
            error={formErrors.name}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Page"
            name="pageKey"
            value={formData.pageKey}
            onChange={onChange}
            options={SEO_MEDIA_PAGES.map((page) => ({ value: page.pageKey, label: page.name }))}
            error={formErrors.pageKey}
          />
          <Select
            label="Loại slot"
            name="type"
            value={formData.type}
            onChange={onChange}
            options={SLOT_TYPE_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Tối thiểu"
            name="minItems"
            type="number"
            min="0"
            value={formData.minItems}
            onChange={onChange}
            error={formErrors.minItems}
          />
          <Input
            label="Tối đa"
            name="maxItems"
            type="number"
            min="0"
            value={formData.maxItems}
            onChange={onChange}
            placeholder="Không giới hạn"
            error={formErrors.maxItems}
          />
          <Input
            label="Rộng khuyến nghị"
            name="recommendedWidth"
            type="number"
            min="0"
            value={formData.recommendedWidth}
            onChange={onChange}
            placeholder="1920"
          />
          <Input
            label="Cao khuyến nghị"
            name="recommendedHeight"
            type="number"
            min="0"
            value={formData.recommendedHeight}
            onChange={onChange}
            placeholder="1080"
          />
        </div>

        <Textarea
          label="Mô tả"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
          maxLength={300}
          placeholder="Mô tả vị trí hiển thị của slot"
        />

        <label className="inline-flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={onChange}
            className="w-4 h-4 accent-foreground"
          />
          Kích hoạt slot
        </label>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={() => onCreateDraft(selectedPage)}>
            <Edit2 size={14} />
            Nháp mới
          </Button>
          <Button type="submit" size="sm" loading={loading} disabled={loading}>
            <Save size={14} />
            Lưu slot
          </Button>
        </div>
      </form>
    </section>
  );
};

