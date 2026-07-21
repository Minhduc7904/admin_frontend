import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, RefreshCw, Rows3 } from 'lucide-react';
import { Button, EmptyState, InlineLoading } from '../../../shared/components';
import { TuitionGradeBankAccountEditor } from '../components';
import {
  getTuitionGradeBankAccountsAsync,
  selectTuitionGradeBankAccounts,
  selectTuitionGradeBankAccountsError,
  selectTuitionGradeBankAccountsLoadingGet,
  selectTuitionGradeBankAccountsLoadingUpdate,
  updateTuitionGradeBankAccountsAsync,
} from '../store/tuitionGradeBankAccountSlice';

export const TuitionGradeBankAccountPage = () => {
  const dispatch = useDispatch();
  const mappings = useSelector(selectTuitionGradeBankAccounts);
  const loadingGet = useSelector(selectTuitionGradeBankAccountsLoadingGet);
  const loadingUpdate = useSelector(selectTuitionGradeBankAccountsLoadingUpdate);
  const error = useSelector(selectTuitionGradeBankAccountsError);
  const mappingKey = mappings.map((mapping) => `${mapping.grade}:${mapping.receivingBankAccountId || ''}`).join('|');

  const loadMappings = useCallback(() => dispatch(getTuitionGradeBankAccountsAsync()), [dispatch]);

  useEffect(() => {
    loadMappings();
  }, [loadMappings]);

  const saveMappings = async (data) => {
    try {
      await dispatch(updateTuitionGradeBankAccountsAsync(data)).unwrap();
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
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Tài khoản theo khối</h1>
          <p className="mt-1 text-sm text-foreground-light">Chọn tài khoản ngân hàng nhận học phí cho từng khối từ 1 đến 12.</p>
        </div>
        <Button variant="outline" onClick={loadMappings} loading={loadingGet}>
          <RefreshCw className="h-4 w-4" /> Làm mới
        </Button>
      </div>

      {loadingGet && mappings.length === 0 ? (
        <div className="rounded-xl border border-border bg-white"><InlineLoading message="Đang tải tài khoản theo khối..." /></div>
      ) : mappings.length > 0 ? (
        <TuitionGradeBankAccountEditor
          key={mappingKey}
          mappings={mappings}
          loading={loadingUpdate}
          onSave={saveMappings}
        />
      ) : (
        <div className="rounded-xl border border-border bg-white shadow-sm">
          <EmptyState
            icon={error ? AlertCircle : Rows3}
            title="Chưa có mapping tài khoản theo khối"
            description="Backend cần khởi tạo 12 mapping cho các khối từ 1 đến 12 trước khi cấu hình trên trang này."
            actionLabel="Thử lại"
            onAction={loadMappings}
          />
        </div>
      )}
    </div>
  );
};
