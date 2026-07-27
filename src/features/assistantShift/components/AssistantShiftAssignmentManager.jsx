import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button, Modal, Textarea } from '../../../shared/components/ui';
import { AssistantSearchSelect } from './AssistantSearchSelect';
import { AssistantShiftAvatar } from './AssistantShiftAvatar';

const STATUS = [
  { value: 'PENDING', label: 'Chưa đi' },
  { value: 'PRESENT', label: 'Đã đi' },
  { value: 'ABSENT', label: 'Vắng' },
];

export const AssistantShiftAssignmentManager = ({ assignments, disabled, loading, canAssign, canSearchAssistants, canUpdate, canDelete, onAdd, onUpdate, onDelete }) => {
  const [assistant, setAssistant] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [managerNote, setManagerNote] = useState('');

  const add = async () => {
    if (!assistant) return;
    await onAdd(assistant);
    setAssistant(null);
  };

  const updateStatus = async (assignment, attendanceStatus) => {
    await onUpdate(assignment.adminId, {
      attendanceStatus,
      absenceReason: assignment.absenceReason || '',
      managerNote: assignment.managerNote || '',
    });
  };

  const openEditNote = (assignment) => {
    setEditingAssignment(assignment);
    setManagerNote(assignment.managerNote || '');
  };

  const saveManagerNote = async () => {
    if (!editingAssignment) return;
    await onUpdate(editingAssignment.adminId, {
      attendanceStatus: editingAssignment.attendanceStatus || 'PENDING',
      absenceReason: editingAssignment.absenceReason || '',
      managerNote,
    });
    setEditingAssignment(null);
  };

  return <section className="border-t border-border pt-5">
    <div className="mb-3 flex items-center justify-between">
      <div><h3 className="font-semibold text-foreground">Phân công trợ giảng</h3><p className="text-xs text-foreground-light">Phân công và điểm danh trợ giảng cho ca này.</p></div>
      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{assignments.length} người</span>
    </div>

    {canAssign && canSearchAssistants && <div className="mb-4 rounded-lg bg-gray-50 p-3"><AssistantSearchSelect value={assistant} onSelect={setAssistant} disabled={disabled || loading} /><Button size="sm" className="mt-2" onClick={add} disabled={!assistant || assignments.some((item) => item.adminId === assistant.adminId)} loading={loading}><Plus className="h-4 w-4" />Phân công</Button></div>}

    <div className="space-y-2">
      {assignments.map((assignment) => <div key={assignment.adminId} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
        <div className="flex min-w-0 items-center gap-2.5"><AssistantShiftAvatar admin={assignment.admin} sizeClass="h-9 w-9" textClass="text-xs" /><div className="min-w-0"><p className="truncate text-sm font-medium">{assignment.admin?.fullName || `Admin #${assignment.adminId}`}</p><p className="truncate text-xs text-foreground-light">{assignment.admin?.email || `ID: ${assignment.adminId}`}</p>{assignment.managerNote && <p className="mt-0.5 truncate text-xs text-foreground-light">{assignment.managerNote}</p>}</div></div>
        <div className="flex shrink-0 items-center gap-1.5"><select aria-label="Trạng thái điểm danh" value={assignment.attendanceStatus || 'PENDING'} disabled={disabled || loading || !canUpdate} onChange={(event) => updateStatus(assignment, event.target.value)} className="max-w-32 rounded-sm border border-border bg-primary px-2 py-1.5 text-xs"><option value="PENDING">Chưa đi</option><option value="PRESENT">Đã đi</option><option value="ABSENT">Vắng</option></select>{canUpdate && <Button size="sm" variant="ghost" disabled={disabled || loading} onClick={() => openEditNote(assignment)}><Pencil className="h-4 w-4" /></Button>}{canDelete && <Button size="sm" variant="ghost" disabled={disabled || loading} onClick={() => onDelete(assignment.adminId)}><Trash2 className="h-4 w-4 text-red-600" /></Button>}</div>
      </div>)}
    </div>
    {!assignments.length && <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-foreground-light">Chưa phân công trợ giảng cho ca này.</p>}

    <Modal isOpen={Boolean(editingAssignment)} onClose={() => setEditingAssignment(null)} title="Sửa ghi chú quản lý">
      <div className="space-y-4"><p className="text-sm text-foreground-light">{editingAssignment?.admin?.fullName || `Admin #${editingAssignment?.adminId || ''}`}</p><Textarea label="Ghi chú quản lý" value={managerNote} onChange={(event) => setManagerNote(event.target.value)} rows={4} maxLength={500} /><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setEditingAssignment(null)}>Hủy</Button><Button loading={loading} onClick={saveManagerNote}>Lưu</Button></div></div>
    </Modal>
  </section>;
};
