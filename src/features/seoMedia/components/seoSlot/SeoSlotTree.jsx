import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

const getSlotItemCount = (slot) => {
  if (Array.isArray(slot?.items)) return slot.items.length;
  if (typeof slot?.items === 'number') return slot.items;
  return 0;
};

export const SeoSlotTree = ({
  loading,
  pages,
  expandedPageKeys,
  selectedPageKey,
  selectedSlot,
  onTogglePage,
  onSelectPage,
  onSelectSlot,
  onCreateDraft,
}) => {
  return (
    <section className="xl:col-span-5 bg-white border border-border rounded-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Page và slot</h2>
      </div>

      <div className="divide-y divide-border">
        {pages.map((page) => {
          const isExpanded = expandedPageKeys.includes(page.pageKey);
          const isSelectedPage = selectedPageKey === page.pageKey;

          return (
            <div key={page.pageKey}>
              <div className={`flex items-center gap-2 px-3 py-2 ${isSelectedPage ? 'bg-gray-50' : ''}`}>
                <button
                  type="button"
                  onClick={() => onTogglePage(page)}
                  className="p-1 rounded-sm hover:bg-gray-100 transition-colors"
                  title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPage(page)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{page.name}</span>
                    <span className="text-xs text-foreground-light whitespace-nowrap">{page.slots.length} slot</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="px-2 py-0.5 rounded bg-gray-100 text-[11px] text-foreground">
                      pageKey: {page.pageKey}
                    </code>
                    <span className="text-xs text-foreground-light truncate">{page.path}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onCreateDraft(page)}
                  className="p-1.5 rounded-sm hover:bg-gray-100 transition-colors"
                  title={`Thêm slot cho ${page.name}`}
                >
                  <Plus size={15} />
                </button>
              </div>

              {isExpanded && (
                <div className="pb-2">
                  {page.slots.length === 0 ? (
                    <div className="mx-4 my-2 px-3 py-2 rounded-sm bg-gray-50 text-xs text-foreground-light">
                      {loading ? 'Đang tải slot...' : 'Chưa có slot nào cho page này.'}
                    </div>
                  ) : (
                    page.slots.map((slot) => {
                      const isSelected = selectedSlot?.slotId === slot.slotId;

                      return (
                        <button
                          key={slot.slotId}
                          type="button"
                          onClick={() => onSelectSlot(slot)}
                          className={`w-full text-left pl-12 pr-4 py-2 transition-colors ${
                            isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground truncate">{slot.name}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                    slot.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {slot.isActive ? 'Đang dùng' : 'Tạm tắt'}
                                </span>
                              </div>
                              <p className="text-xs text-foreground-light mt-1 truncate">{slot.description || '-'}</p>
                              <code className="inline-flex mt-2 px-2 py-0.5 rounded bg-gray-100 text-xs text-foreground">
                                {slot.code}
                              </code>
                            </div>
                            <span className="text-xs text-foreground-light whitespace-nowrap">{getSlotItemCount(slot)} ảnh</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
