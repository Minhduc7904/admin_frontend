import { createElement } from 'react';
import { Banknote, CheckCircle2, CircleDotDashed, Landmark, ShieldCheck } from 'lucide-react';

const StatCard = ({ label, value, icon, tone }) => (
  <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-foreground-light">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      </div>
      <div className={`rounded-lg p-2 ${tone}`}>{createElement(icon, { className: 'h-5 w-5' })}</div>
    </div>
  </div>
);

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const BankTransferTransactionStatistics = ({ statistics, loading }) => {
  const data = statistics || {};
  const display = (value) => (loading ? '—' : Number(value || 0).toLocaleString('vi-VN'));

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Tổng giao dịch" value={display(data.totalTransactions)} icon={Landmark} tone="bg-blue-50 text-blue-700" />
      <StatCard label="Chưa đối soát" value={display(data.unreconciledTransactions)} icon={CircleDotDashed} tone="bg-amber-50 text-amber-700" />
      <StatCard label="Tự động đối soát" value={display(data.automaticReconciledTransactions)} icon={ShieldCheck} tone="bg-emerald-50 text-emerald-700" />
      <StatCard label="Admin đối soát" value={display(data.adminReconciledTransactions)} icon={CheckCircle2} tone="bg-violet-50 text-violet-700" />
      <StatCard label="Tổng số tiền" value={loading ? '—' : formatMoney(data.totalAmount)} icon={Banknote} tone="bg-rose-50 text-rose-700" />
    </div>
  );
};
