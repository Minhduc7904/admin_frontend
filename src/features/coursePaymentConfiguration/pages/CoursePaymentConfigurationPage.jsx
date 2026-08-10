import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Save, Settings2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { coursePaymentConfigurationApi } from '../../../core/api';
import { Button, EmptyState, InlineLoading } from '../../../shared/components';
import { ReceivingBankAccountSearchSelect } from '../../receivingBankAccount/components';
import { addNotification } from '../../notification/store/notificationSlice';

const getResponseData = (response) => response?.data?.data ?? response?.data ?? response;

const getInitialAccount = (configuration) => configuration?.receivingBankAccountId ? {
  receivingBankAccountId: configuration.receivingBankAccountId,
  displayName: `Tài khoản #${configuration.receivingBankAccountId}`,
} : null;

const CoursePaymentConfigurationForm = ({ configuration, loading, onSave }) => {
  const [selectedAccount, setSelectedAccount] = useState(getInitialAccount(configuration));
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedAccount(getInitialAccount(configuration));
  }, [configuration]);

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedAccount?.receivingBankAccountId) {
      setError('Vui lòng chọn tài khoản nhận tiền đang hoạt động.');
      return;
    }
    await onSave({ receivingBankAccountId: selectedAccount.receivingBankAccountId });
  };

  return <form onSubmit={submit} className="rounded-xl border border-border bg-white shadow-sm">
    <div className="flex items-start gap-3 border-b border-border p-5">
      <div className="rounded-lg bg-violet-50 p-2 text-violet-700"><Settings2 className="h-5 w-5" /></div>
      <div>
        <h2 className="font-semibold text-foreground">Tài khoản nhận tiền mua khóa học</h2>
        <p className="mt-1 text-sm text-foreground-light">Cấu hình được áp dụng cho hướng dẫn thanh toán SePay được tạo sau khi lưu.</p>
      </div>
    </div>
    <div className="p-5">
      <ReceivingBankAccountSearchSelect
        value={selectedAccount}
        onSelect={(account) => {
          setSelectedAccount(account);
          setError('');
        }}
        error={error}
        required
      />
    </div>
    <div className="flex items-center justify-end border-t border-border bg-gray-50 px-5 py-4">
      <Button type="submit" loading={loading}><Save className="h-4 w-4" /> Lưu cấu hình</Button>
    </div>
  </form>;
};

export const CoursePaymentConfigurationPage = () => {
  const dispatch = useDispatch();
  const [configuration, setConfiguration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const loadConfiguration = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const response = await coursePaymentConfigurationApi.get();
      setConfiguration(getResponseData(response));
    } catch (error) {
      if (error?.response?.status === 404) setConfiguration(null);
      else setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  const saveConfiguration = async (data) => {
    setSaving(true);
    try {
      const response = await coursePaymentConfigurationApi.update(data);
      setConfiguration(getResponseData(response));
      dispatch(addNotification({
        type: 'success',
        title: 'Đã cập nhật cấu hình thanh toán khóa học',
        message: 'Tài khoản nhận tiền SePay đã được lưu.',
        autoHide: true,
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Không thể cập nhật cấu hình thanh toán khóa học',
        message: error?.data?.message || error?.message,
        autoHide: true,
      }));
    } finally {
      setSaving(false);
    }
  };

  return <div className="space-y-6 p-4 md:p-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-sm font-medium text-violet-600">MUA KHÓA HỌC</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Cấu hình thanh toán khóa học</h1>
        <p className="mt-1 text-sm text-foreground-light">Chọn tài khoản nhận tiền SePay cho luồng học sinh mua khóa học online.</p>
      </div>
      <Button variant="outline" onClick={loadConfiguration} loading={loading}><RefreshCw className="h-4 w-4" /> Làm mới</Button>
    </div>
    {loading ? <div className="rounded-xl border border-border bg-white"><InlineLoading message="Đang tải cấu hình thanh toán khóa học..." /></div> : loadFailed ? (
      <div className="rounded-xl border border-border bg-white shadow-sm"><EmptyState icon={AlertCircle} title="Không thể tải cấu hình" description="Hãy kiểm tra kết nối và thử lại." actionLabel="Thử lại" onAction={loadConfiguration} /></div>
    ) : <CoursePaymentConfigurationForm configuration={configuration} loading={saving} onSave={saveConfiguration} />}
  </div>;
};
