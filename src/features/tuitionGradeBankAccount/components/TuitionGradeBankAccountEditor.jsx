import { useMemo, useState } from 'react';
import { AlertTriangle, Save } from 'lucide-react';
import { Badge, Button, Table } from '../../../shared/components/ui';
import { useHasPermission } from '../../../shared/hooks';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';
import { ReceivingBankAccountSearchSelect } from '../../receivingBankAccount/components';

const FALLBACK_REASONS = {
  COLLECTION_CONFIGURATION_MISSING: 'Chưa khởi tạo cấu hình thu học phí',
  COLLECTION_MODE_MANUAL_FALLBACK: 'Cấu hình thu đang ở chế độ thủ công',
  GRADE_BANK_NOT_CONFIGURED: 'Chưa gán tài khoản cho khối này',
  GRADE_BANK_INACTIVE: 'Tài khoản được gán đang tắt',
  SEPAY_BANK_STATUS_UNKNOWN: 'Tài khoản chưa kết nối SePay',
  SEPAY_BANK_INACTIVE: 'Tài khoản SePay đang ngừng hoạt động',
};

const getAccountLabel = (account) => account?.displayName
  || (account?.bankCode ? `${account.bankCode} · ${account.accountNumber || '—'}` : null)
  || 'Chưa gán';

const initialSelection = (mappings) => Object.fromEntries(mappings.map((mapping) => [
  mapping.grade,
  mapping.receivingBankAccount || (mapping.receivingBankAccountId ? {
    receivingBankAccountId: mapping.receivingBankAccountId,
    displayName: `Tài khoản #${mapping.receivingBankAccountId}`,
  } : null),
]));

export const TuitionGradeBankAccountEditor = ({ mappings, loading, onSave }) => {
  const canSearchBank = useHasPermission(PERMISSIONS.RECEIVING_BANK_ACCOUNT.GET_ALL);
  const [selectedAccounts, setSelectedAccounts] = useState(() => initialSelection(mappings));

  const changedMappings = useMemo(() => mappings
    .map((mapping) => ({
      grade: mapping.grade,
      receivingBankAccountId: selectedAccounts[mapping.grade]?.receivingBankAccountId || null,
      previousReceivingBankAccountId: mapping.receivingBankAccountId || null,
    }))
    .filter((mapping) => mapping.receivingBankAccountId !== mapping.previousReceivingBankAccountId)
    .map(({ grade, receivingBankAccountId }) => ({ grade, receivingBankAccountId })), [mappings, selectedAccounts]);

  const save = () => onSave({ mappings: changedMappings });

  const columns = [
    {
      key: 'grade',
      label: 'Khối',
      render: (mapping) => <span className="font-semibold text-foreground">Khối {mapping.grade}</span>,
    },
    {
      key: 'receivingBankAccount',
      label: 'Tài khoản nhận tiền',
      render: (mapping) => canSearchBank ? (
        <ReceivingBankAccountSearchSelect
          label=""
          placeholder="Dùng tài khoản fallback mặc định"
          value={selectedAccounts[mapping.grade]}
          onSelect={(account) => setSelectedAccounts((current) => ({ ...current, [mapping.grade]: account }))}
          status={null}
          disabled={loading}
          className="min-w-[260px]"
        />
      ) : (
        <div>
          <p className="font-medium text-foreground">{getAccountLabel(mapping.receivingBankAccount)}</p>
          <p className="mt-1 text-xs text-foreground-light">Bạn cần quyền xem danh sách tài khoản để thay đổi gán bank.</p>
        </div>
      ),
    },
    {
      key: 'confirmationMode',
      label: 'Xác nhận hiện tại',
      render: (mapping) => mapping.confirmationMode === 'AUTOMATIC' ? (
        <Badge variant="success">Tự động</Badge>
      ) : (
        <div className="space-y-1">
          <Badge variant="warning">Đối soát thủ công</Badge>
          <p className="text-xs text-foreground-light">{FALLBACK_REASONS[mapping.fallbackReason] || mapping.fallbackReason || '—'}</p>
        </div>
      ),
    },
    {
      key: 'fallback',
      label: 'Tài khoản fallback',
      render: (mapping) => (
        <div>
          <p className="font-medium text-foreground">{getAccountLabel(mapping.defaultManualReceivingBankAccount)}</p>
          <p className="text-xs text-foreground-light">
            {mapping.isManualFallbackAvailable ? 'Sẵn sàng dùng khi đối soát thủ công' : 'Chưa có fallback thủ công khả dụng'}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Phân luồng tài khoản theo khối</h2>
          <p className="mt-1 text-sm text-foreground-light">Bỏ gán một khối để dùng tài khoản fallback thủ công mặc định.</p>
        </div>
        <Badge variant="default">{changedMappings.length} thay đổi chưa lưu</Badge>
      </div>

      {!canSearchBank && (
        <div className="mx-5 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Cần thêm quyền <code>receiving-bank-account:get-all</code> để hiển thị ô tìm và thay đổi tài khoản ngân hàng.
        </div>
      )}

      <Table
        columns={columns}
        data={mappings}
        loading={false}
        emptyMessage="Không có mapping theo khối"
        emptySubMessage="Hệ thống cần khởi tạo đủ 12 mapping từ khối 1 đến khối 12."
      />

      <div className="flex justify-end border-t border-border bg-gray-50 p-4">
        <Button onClick={save} loading={loading} disabled={!canSearchBank || changedMappings.length === 0}>
          <Save className="h-4 w-4" /> Lưu {changedMappings.length || ''} thay đổi
        </Button>
      </div>
    </div>
  );
};
