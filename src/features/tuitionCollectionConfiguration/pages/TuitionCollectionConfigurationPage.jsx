import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, RefreshCw, Settings2 } from 'lucide-react';
import { Button, EmptyState, InlineLoading } from '../../../shared/components';
import { TuitionCollectionConfigurationForm } from '../components';
import {
  getTuitionCollectionConfigurationAsync,
  selectTuitionCollectionConfiguration,
  selectTuitionCollectionConfigurationError,
  selectTuitionCollectionConfigurationLoadingGet,
  selectTuitionCollectionConfigurationLoadingUpdate,
  updateTuitionCollectionConfigurationAsync,
} from '../store/tuitionCollectionConfigurationSlice';

export const TuitionCollectionConfigurationPage = () => {
  const dispatch = useDispatch();
  const configuration = useSelector(selectTuitionCollectionConfiguration);
  const loadingGet = useSelector(selectTuitionCollectionConfigurationLoadingGet);
  const loadingUpdate = useSelector(selectTuitionCollectionConfigurationLoadingUpdate);
  const error = useSelector(selectTuitionCollectionConfigurationError);

  const loadConfiguration = useCallback(() => dispatch(getTuitionCollectionConfigurationAsync()), [dispatch]);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  const saveConfiguration = async (data) => {
    try {
      await dispatch(updateTuitionCollectionConfigurationAsync(data)).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">THU HỌC PHÍ</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Cấu hình thu học phí</h1>
          <p className="mt-1 text-sm text-foreground-light">Quản lý mode thu và tài khoản ngân hàng mặc định cho luồng đối soát thủ công.</p>
        </div>
        <Button variant="outline" onClick={loadConfiguration} loading={loadingGet}>
          <RefreshCw className="h-4 w-4" /> Làm mới
        </Button>
      </div>

      {loadingGet && !configuration ? (
        <div className="rounded-xl border border-border bg-white"><InlineLoading message="Đang tải cấu hình thu học phí..." /></div>
      ) : configuration ? (
        <TuitionCollectionConfigurationForm
          key={configuration.tuitionCollectionConfigurationId}
          configuration={configuration}
          loading={loadingUpdate}
          onSave={saveConfiguration}
        />
      ) : (
        <div className="rounded-xl border border-border bg-white shadow-sm">
          <EmptyState
            icon={error ? AlertCircle : Settings2}
            title="Chưa có cấu hình thu học phí"
            description="Bản ghi cấu hình singleton chưa được khởi tạo. Hãy khởi tạo cấu hình ở backend trước khi quản lý trên trang này."
            actionLabel="Thử lại"
            onAction={loadConfiguration}
          />
        </div>
      )}
    </div>
  );
};
