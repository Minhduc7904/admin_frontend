import { Check, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AssistantShiftAvatar } from '../../assistantShift/components';
import { Button, Modal } from '../../../shared/components/ui';

const dateKey = (value) => new Date(value).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
const timeLabel = (value) => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const SelectablePerson = ({ admin, selected, disabled, note, onSelect }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onSelect}
    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${disabled ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-70' : selected ? 'border-violet-500 bg-violet-50' : 'border-border hover:border-violet-300 hover:bg-gray-50'}`}
  >
    <AssistantShiftAvatar admin={admin} sizeClass="h-10 w-10" textClass="text-xs" />
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-medium">{admin?.fullName || `Admin #${admin?.adminId}`}</span>
      {note && <span className="mt-0.5 block text-xs font-semibold text-amber-700">{note}</span>}
    </span>
    {!disabled && <span className={`flex h-5 w-5 items-center justify-center rounded border ${selected ? 'border-violet-600 bg-violet-600 text-white' : 'border-gray-300 bg-white'}`}>{selected && <Check className="h-3.5 w-3.5" />}</span>}
  </button>
);

export const TransferAssistantShiftModal = ({ shift, assistants, loading, selectedAdminId, onSelect, saving, onClose, onConfirm }) => {
  const [search, setSearch] = useState('');

  const people = useMemo(() => {
    const byId = new Map(assistants.map((admin) => [admin.adminId, admin]));
    (shift?.assignments || []).forEach((assignment) => {
      if (!byId.has(assignment.adminId)) byId.set(assignment.adminId, assignment.admin || { adminId: assignment.adminId });
    });
    const keyword = search.trim().toLocaleLowerCase('vi-VN');
    return [...byId.values()].filter((admin) => !keyword || `${admin.fullName || ''} ${admin.email || ''} ${admin.adminId}`.toLocaleLowerCase('vi-VN').includes(keyword));
  }, [assistants, search, shift?.assignments]);

  return (
    <Modal isOpen={Boolean(shift)} onClose={onClose} title="Nhường ca" fullScreenOnMobile>
      <div className="space-y-4">
        <p className="text-sm text-foreground-light">Chọn một trợ giảng để gửi đề nghị nhường ca “{shift?.name}”. Người nhận sẽ xác nhận qua email.</p>
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-light" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên, email hoặc mã trợ giảng..." className="h-10 w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
        </label>
        <div className="max-h-[52dvh] space-y-2 overflow-auto pr-1 md:max-h-80">
          {loading ? <p className="rounded-lg bg-gray-50 p-4 text-sm text-foreground-light">Đang tải danh sách trợ giảng...</p> : people.map((admin) => {
            const assigned = shift?.assignments?.some((assignment) => Number(assignment.adminId) === Number(admin.adminId));
            return <SelectablePerson key={admin.adminId} admin={admin} selected={selectedAdminId === admin.adminId} disabled={assigned} note={assigned ? 'Đã trong ca này' : ''} onSelect={() => onSelect(admin.adminId)} />;
          })}
          {!loading && !people.length && <p className="rounded-lg bg-gray-50 p-4 text-sm text-foreground-light">Không tìm thấy trợ giảng phù hợp.</p>}
        </div>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Hủy</Button><Button disabled={!selectedAdminId} loading={saving} onClick={onConfirm}>Gửi đề nghị nhường ca</Button></div>
      </div>
    </Modal>
  );
};

export const SwapAssistantShiftModal = ({ targetShift, myShifts, loading, selectedAdminId, selectedMyShiftId, onSelectAdmin, onSelectMyShift, saving, onClose, onConfirm, profile }) => {
  const people = (targetShift?.assignments || []).filter((assignment) => assignment.adminId !== profile?.adminId && assignment.attendanceStatus === 'PENDING');
  const myPendingShifts = myShifts.filter((shift) => shift.assistantShiftId !== targetShift?.assistantShiftId);
  return (
    <Modal isOpen={Boolean(targetShift)} onClose={onClose} title="Đổi ca" size="4xl" fullScreenOnMobile>
      <div className="space-y-5">
        <p className="text-base text-foreground-light">Chọn lịch của bạn ở bên trái, sau đó chọn trợ giảng đang ở ca này ở bên phải để gửi đề nghị đổi ca qua email.</p>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" /><p className="text-base font-semibold">1. Chọn lịch chưa đi của bạn</p></div>
            <div className="max-h-[30dvh] space-y-2 overflow-auto rounded-lg border border-border bg-gray-50 p-3 md:max-h-[52vh]">
              {loading ? <p className="p-3 text-sm text-foreground-light">Đang tải lịch...</p> : myPendingShifts.map((shift) => { const pendingExchange = shift.assignments?.some((assignment) => (assignment.adminId === profile?.adminId || assignment.admin?.userId === profile?.userId) && assignment.isPendingExchangeRequest); return <button type="button" disabled={pendingExchange} key={shift.assistantShiftId} onClick={() => onSelectMyShift(shift.assistantShiftId)} className={`w-full rounded-lg border p-3 text-left transition ${pendingExchange ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500' : selectedMyShiftId === shift.assistantShiftId ? 'border-blue-600 bg-blue-50' : 'border-border bg-white hover:border-blue-300'}`}><p className="text-xs font-medium text-foreground-light">{dateKey(shift.startAt)} · {timeLabel(shift.startAt)} – {timeLabel(shift.endAt)}</p><p className="mt-1 text-sm font-semibold">{shift.name}</p><p className="mt-1 truncate text-xs text-foreground-light">{shift.courseClass?.className || shift.courseClass?.name || shift.series?.name}</p>{pendingExchange && <p className="mt-1 text-xs font-semibold text-violet-700">Đã gửi email, đang chờ xác nhận</p>}</button>; })}
              {!loading && !myPendingShifts.length && <p className="p-3 text-sm text-foreground-light">Bạn không có ca chưa đi để đổi.</p>}
            </div>
          </div>
          <div>
            <p className="mb-3 text-base font-semibold">2. Chọn trợ giảng trong ca “{targetShift?.name}”</p>
            <div className="max-h-[30dvh] space-y-2 overflow-auto pr-1 md:max-h-[52vh]">
              {people.map((assignment) => <SelectablePerson key={assignment.adminId} admin={assignment.admin} selected={selectedAdminId === assignment.adminId} disabled={assignment.isPendingExchangeRequest} note={assignment.isPendingExchangeRequest ? 'Đã gửi email, đang chờ xác nhận' : ''} onSelect={() => onSelectAdmin(assignment.adminId)} />)}
              {!people.length && <p className="rounded-lg bg-gray-50 p-3 text-sm text-foreground-light">Không có phân công chưa đi để đổi.</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Hủy</Button><Button disabled={!selectedAdminId || !selectedMyShiftId} loading={saving} onClick={onConfirm}>Gửi đề nghị đổi ca</Button></div>
      </div>
    </Modal>
  );
};
