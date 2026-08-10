import { CheckCircle2, CircleDotDashed, CircleX, Clock3, ShieldCheck, TriangleAlert, XCircle } from 'lucide-react';

export const PROCESSING_STATUS = {
  RECEIVED: { label: 'Đã nhận', className: 'bg-blue-50 text-blue-700', icon: Clock3 },
  MATCHED: { label: 'Đã khớp', className: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  UNMATCHED: { label: 'Chưa khớp', className: 'bg-amber-50 text-amber-700', icon: CircleDotDashed },
  AMOUNT_MISMATCH: { label: 'Sai số tiền', className: 'bg-orange-50 text-orange-700', icon: TriangleAlert },
  IGNORED: { label: 'Đã bỏ qua', className: 'bg-slate-100 text-slate-700', icon: CircleX },
  ERROR: { label: 'Lỗi xử lý', className: 'bg-red-50 text-red-700', icon: XCircle },
};

export const RECONCILIATION_STATUS = {
  UNRECONCILED: { label: 'Chưa đối soát', className: 'bg-amber-50 text-amber-700', icon: Clock3 },
  AUTOMATIC: { label: 'Tự động đối soát', className: 'bg-emerald-50 text-emerald-700', icon: ShieldCheck },
  ADMIN: { label: 'Admin đối soát', className: 'bg-violet-50 text-violet-700', icon: CheckCircle2 },
};

export const TRANSACTION_TYPE = {
  TUITION_PAYMENT: { label: 'Thu học phí', className: 'bg-blue-50 text-blue-700' },
  COURSE_PURCHASE: { label: 'Mua khóa học', className: 'bg-violet-50 text-violet-700' },
  UNCLASSIFIED: { label: 'Chưa phân loại', className: 'bg-slate-100 text-slate-700' },
};

export const TRANSACTION_TYPE_OPTIONS = [
  { value: '', label: 'Tất cả loại giao dịch' },
  { value: 'TUITION_PAYMENT', label: TRANSACTION_TYPE.TUITION_PAYMENT.label },
  { value: 'COURSE_PURCHASE', label: TRANSACTION_TYPE.COURSE_PURCHASE.label },
  { value: 'UNCLASSIFIED', label: TRANSACTION_TYPE.UNCLASSIFIED.label },
];

export const getTransactionTypeFilterParams = (type, includeUnclassified = false) => ({
  type: type && type !== 'UNCLASSIFIED' ? type : undefined,
  includeUnclassified: type === 'UNCLASSIFIED' || includeUnclassified || undefined,
});

export const PROCESSING_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả xử lý' },
  ...Object.entries(PROCESSING_STATUS).map(([value, item]) => ({ value, label: item.label })),
];

export const RECONCILIATION_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả đối soát' },
  ...Object.entries(RECONCILIATION_STATUS).map(([value, item]) => ({ value, label: item.label })),
];
