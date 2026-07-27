import { CalendarDays, Clock3, LockKeyhole, Users, X } from 'lucide-react';
import { AssistantShiftAvatar } from '../../assistantShift/components';
import { Button, Modal } from '../../../shared/components/ui';

const timeLabel = (value) => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const dateLabel = (value) => new Date(value).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
const isMine = (item, profile) => item.adminId === profile?.adminId || item.admin?.adminId === profile?.adminId || item.admin?.userId === profile?.userId;
const attendanceLabel = (status) => status === 'PRESENT' ? 'Đã đi' : status === 'ABSENT' ? 'Vắng' : 'Chưa đi';

export const AssistantShiftRegistrationDetailModal = ({ shift, profile, actionShiftId, canRegister, canCancel, canTransfer, canSwap, onClose, onRegister, onCancel, onTransfer, onSwap }) => {
  if (!shift) return null;

  const assignments = shift.assignments || [];
  const ownAssignment = assignments.find((item) => isMine(item, profile));
  const joined = Boolean(ownAssignment);
  const full = assignments.length >= (shift.requiredAssistantCount || 1);
  const isPast = new Date(shift.endAt).getTime() <= new Date(shift.openedAt).getTime();
  const locked = shift.isLocked || shift.series?.isLocked || shift.isBaseShift;
  const pendingExchange = Boolean(ownAssignment?.isPendingExchangeRequest);
  const canManageOwn = ownAssignment?.attendanceStatus === 'PENDING' && !pendingExchange;
  const disabled = Boolean(actionShiftId) || isPast || locked || pendingExchange;
  const closeAfter = async (action) => { await action(); onClose(); };

  return (
    <Modal isOpen={Boolean(shift)} onClose={onClose} size="max" showCloseButton={false} fullScreenOnMobile customContent>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between border-b border-slate-100 px-4 py-4 md:px-6">
          <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Ca trợ giảng</p><h2 className="mt-1 truncate text-xl font-bold text-slate-900">{shift.name}</h2></div>
          <button type="button" onClick={onClose} aria-label="Đóng chi tiết" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
          <div className="mx-auto max-w-2xl space-y-5">
            <section className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-blue-600" /><span className="capitalize">{dateLabel(shift.startAt)}</span></div>
              <div className="mt-3 flex items-center gap-3"><Clock3 className="h-5 w-5 text-blue-600" /><span>{timeLabel(shift.startAt)} – {timeLabel(shift.endAt)}</span></div>
              <div className="mt-3 flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><span>{assignments.length}/{shift.requiredAssistantCount} trợ giảng</span></div>
              {locked && <div className="mt-3 flex items-center gap-3 font-semibold text-amber-700"><LockKeyhole className="h-5 w-5" />Ca này đang khóa</div>}
            </section>
            <section><h3 className="text-sm font-bold text-slate-900">Ghi chú</h3><p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{shift.notes || 'Chưa có ghi chú công việc.'}</p></section>
            <section><h3 className="text-sm font-bold text-slate-900">Trợ giảng đã đăng ký</h3><div className="mt-2 overflow-hidden rounded-2xl border border-slate-100">{assignments.length ? assignments.map((item) => <div key={item.adminId} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"><AssistantShiftAvatar admin={item.admin} status={item.attendanceStatus} sizeClass="h-9 w-9" textClass="text-[10px]" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{item.admin?.fullName || `Admin #${item.adminId}`}</p>{item.admin?.email && <p className="truncate text-xs text-slate-500">{item.admin.email}</p>}<p className="mt-0.5 text-xs text-slate-500">{attendanceLabel(item.attendanceStatus)}</p></div></div>) : <p className="p-4 text-sm text-slate-500">Chưa có trợ giảng đăng ký.</p>}</div></section>
          </div>
        </div>
        <div className="border-t border-slate-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6"><div className="mx-auto flex max-w-2xl flex-wrap justify-end gap-2">{!joined && !full && canRegister && <Button loading={Boolean(actionShiftId)} disabled={disabled} onClick={() => closeAfter(() => onRegister(shift.assistantShiftId))}>Đăng ký ca</Button>}{joined && canCancel && canManageOwn && <Button variant="outline" loading={Boolean(actionShiftId)} disabled={disabled} onClick={() => closeAfter(() => onCancel(shift.assistantShiftId))}>Hủy ca</Button>}{joined && canTransfer && canManageOwn && <Button loading={Boolean(actionShiftId)} disabled={disabled} onClick={() => onTransfer(shift)}>Nhường ca</Button>}{!joined && full && canSwap && <Button loading={Boolean(actionShiftId)} disabled={disabled} onClick={() => onSwap(shift)}>Đổi ca</Button>}</div></div>
      </div>
    </Modal>
  );
};
