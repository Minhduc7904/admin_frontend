import { useDispatch, useSelector } from 'react-redux';
import { SEO_MEDIA_PAGES } from '../../constants/seoMedia.constant';
import {
  selectSeoPageMediaActivePageKey,
  setSeoPageMediaActivePageKey,
} from '../../store/seoMediaSlice';

export const SeoPageSelector = () => {
  const dispatch = useDispatch();
  const activePageKey = useSelector(selectSeoPageMediaActivePageKey);

  return (
    <aside className="xl:col-span-3 bg-white border border-border rounded-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Page</h2>
      </div>
      <div className="p-2 space-y-1">
        {SEO_MEDIA_PAGES.map((page) => {
          const active = page.pageKey === activePageKey;

          return (
            <button
              key={page.pageKey}
              type="button"
              onClick={() => dispatch(setSeoPageMediaActivePageKey(page.pageKey))}
              className={`w-full text-left px-3 py-2 rounded-sm transition-colors ${
                active ? 'bg-gray-100 text-foreground' : 'text-foreground-light hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{page.name}</span>
                <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded">{page.pageKey}</code>
              </div>
              <div className="text-xs text-foreground-light mt-0.5">{page.path}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
