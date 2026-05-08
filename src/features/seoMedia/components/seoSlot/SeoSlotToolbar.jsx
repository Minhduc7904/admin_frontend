import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '../../../../shared/components/ui';

export const SeoSlotToolbar = ({ loading, selectedPage, onReload, onCreateDraft }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý SEO slots</h1>
        <p className="text-sm text-foreground-light mt-1">
          Slot được nhóm theo pageKey và tải bằng query pageKey.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => onReload(selectedPage.pageKey, true)} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Tải lại
        </Button>
        <Button onClick={() => onCreateDraft(selectedPage)}>
          <Plus size={16} />
          Tạo slot
        </Button>
      </div>
    </div>
  );
};
