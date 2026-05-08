import { Monitor, Smartphone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../shared/components/ui';
import {
  selectSeoPageMediaViewMode,
  setSeoPageMediaViewMode,
} from '../../store/seoMediaSlice';

export const SeoPageHeader = () => {
  const dispatch = useDispatch();
  const viewMode = useSelector(selectSeoPageMediaViewMode);

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO theo page</h1>
        <p className="text-sm text-foreground-light mt-1">
          Chọn page, chọn slot và chuẩn bị ảnh SEO cho từng vị trí.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'desktop' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => dispatch(setSeoPageMediaViewMode('desktop'))}
        >
          <Monitor size={15} />
          Desktop
        </Button>
        <Button
          variant={viewMode === 'mobile' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => dispatch(setSeoPageMediaViewMode('mobile'))}
        >
          <Smartphone size={15} />
          Mobile
        </Button>
      </div>
    </div>
  );
};
