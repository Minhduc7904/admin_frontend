import { CalendarDays, ChevronLeft, ChevronRight, Copy, FileText, Link as LinkIcon, PlusCircle, RefreshCw, Save, Youtube } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';
import { Button, Input, RightPanel } from '../../../shared/components/ui';
import { useHasPermission } from '../../../shared/hooks/permissions';
import { AssistantSearchSelect, AssistantShiftMiniCalendar } from '../../assistantShift/components';
import {
  createAssistantTaskAsync,
  getAssistantTasksAsync,
  selectAssistantTasks,
  selectAssistantTasksError,
  selectAssistantTasksLoading,
  selectAssistantTasksMeta,
  selectAssistantTasksSaving,
} from '../store/assistantTaskManagementSlice';

const TASK_TYPE_LABELS = {
  BTVN: 'BTVN',
  VIDEO: 'Video',
  BTTL: 'BTTL',
  BAI_CHAM: 'Bài chấm',
};

const STATUS_LABELS = {
  PENDING: ['Chờ làm', 'bg-blue-50 text-blue-700 ring-blue-100'],
  IN_PROGRESS: ['Đang làm', 'bg-amber-50 text-amber-700 ring-amber-100'],
  COMPLETED: ['Hoàn thành', 'bg-emerald-50 text-emerald-700 ring-emerald-100'],
};

const mondayOf = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return date; };
const addDays = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const dayString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const isoStart = (date) => { const next = new Date(date); next.setHours(0, 0, 0, 0); return next.toISOString(); };
const isoEnd = (date) => { const next = new Date(date); next.setHours(23, 59, 59, 999); return next.toISOString(); };
const weekRange = (start) => `${start.getDate()}/${start.getMonth() + 1} - ${addDays(start, 6).getDate()}/${addDays(start, 6).getMonth() + 1}/${addDays(start, 6).getFullYear()}`;
const formatDateTime = (value) => (value ? new Date(value).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Chưa có');
const inputToIso = (value) => (value ? new Date(value).toISOString() : null);
const defaultDeadlineInput = (monday) => `${dayString(addDays(monday, 6))}T17:00`;

const StatusBadge = ({ status }) => {
  const [label, className] = STATUS_LABELS[status] || ['Không rõ', 'bg-gray-50 text-gray-600 ring-gray-100'];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>{label}</span>;
};

const AssistantCell = ({ task }) => {
  const assistant = task.assistant || task.admin;
  const name = assistant?.fullName || task.assistantName || (task.assistantId ? `Admin #${task.assistantId}` : 'Chưa gán');
  return (
    <div className="min-w-[150px]">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-0.5 text-xs text-foreground-light">{task.assistantId ? `ID ${task.assistantId}` : 'Không có assistantId'}</p>
    </div>
  );
};

const ProductNameCell = ({ products }) => {
  if (!products?.length) return <span className="text-sm text-foreground-light">Chưa có sản phẩm</span>;
  return (
    <div className="max-w-[220px] space-y-1.5">
      {products.map((product) => (
        <p key={product.assistantTaskProductId} className="line-clamp-2 text-sm font-medium text-foreground">
          {product.name || `Product #${product.assistantTaskProductId}`}
        </p>
      ))}
    </div>
  );
};

const ProductExamCell = ({ products }) => {
  if (!products?.length) return <span className="text-sm text-foreground-light">Chưa nộp product</span>;
  return (
    <div className="min-w-[260px] space-y-2">
      {products.map((product) => (
        <div key={product.assistantTaskProductId} className="rounded-lg border border-border bg-gray-50 px-3 py-2">
          {product.examId ? (
            <Link to={ROUTES.EXAM_DETAIL(product.examId)} className="line-clamp-1 text-sm font-semibold text-blue-700 hover:text-blue-900">
              {product.examName || `Đề thi #${product.examId}`}
            </Link>
          ) : (
            <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.examName || 'Chưa gắn đề thi'}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${product.examFileName ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              <FileText className="h-3 w-3" />
              {product.examFileName ? 'Có đề' : 'Chưa có đề'}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${product.examSolutionFileName ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
              <LinkIcon className="h-3 w-3" />
              {product.examSolutionFileName ? 'Có solution file' : 'Chưa có solution'}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${product.solutionYoutubeUrl ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
              <Youtube className="h-3 w-3" />
              {product.solutionYoutubeUrl ? 'Có YouTube' : 'Chưa có YouTube'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const initialForm = (monday) => ({
  selectedAssistant: null,
  taskName: '',
  taskType: 'BAI_CHAM',
  status: 'PENDING',
  deadlineAt: defaultDeadlineInput(monday),
});

const AddTaskPanel = ({ open, onClose, monday, mode, saving, onCreate }) => {
  const [form, setForm] = useState(() => initialForm(monday));

  const change = (field, value) => setForm((current) => ({
    ...current,
    [field]: value,
  }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.taskName.trim()) return;
    const payload = {
      assistantId: form.selectedAssistant?.adminId || null,
      taskName: form.taskName.trim(),
      taskType: form.taskType,
      status: form.status,
      isBaseTask: mode === 'base',
      deadlineAt: inputToIso(form.deadlineAt),
    };
    await onCreate(payload);
    setForm(initialForm(monday));
  };

  return (
    <RightPanel isOpen={open} onClose={onClose} title={`Tạo task ${mode === 'base' ? 'cơ sở' : 'mới'}`} width="w-full max-w-xl">
      <form onSubmit={submit} className="space-y-5 p-5">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-blue-800">
            <PlusCircle className="h-4 w-4" />
            Task sẽ được lọc theo deadline trong tuần đang chọn.
          </p>
          <p className="mt-1 text-xs text-blue-700">Mặc định deadline là cuối tuần lúc 17:00.</p>
        </div>
        <AssistantSearchSelect
          label="Trợ giảng"
          placeholder="Chọn trợ giảng..."
          value={form.selectedAssistant}
          onSelect={(assistant) => change('selectedAssistant', assistant)}
          disabled={saving}
        />
        <Input
          label="Task name"
          value={form.taskName}
          onChange={(event) => change('taskName', event.target.value)}
          placeholder="Nhập tên task..."
          required
          disabled={saving}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-foreground">
            Task type
            <select value={form.taskType} onChange={(event) => change('taskType', event.target.value)} disabled={saving} className="mt-1 w-full rounded-sm border border-border bg-primary px-3 py-2 text-sm focus:outline-none focus:border-foreground">
              {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Status
            <select value={form.status} onChange={(event) => change('status', event.target.value)} disabled={saving} className="mt-1 w-full rounded-sm border border-border bg-primary px-3 py-2 text-sm focus:outline-none focus:border-foreground">
              {Object.entries(STATUS_LABELS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <Input
          label="Deadline"
          type="datetime-local"
          value={form.deadlineAt}
          onChange={(event) => change('deadlineAt', event.target.value)}
          disabled={saving}
        />
        <div className="flex justify-end gap-2 border-t border-border pt-5">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Đóng</Button>
          <Button type="submit" loading={saving} disabled={!form.taskName.trim()}>
            <Save className="h-4 w-4" />
            Lưu
          </Button>
        </div>
      </form>
    </RightPanel>
  );
};

const CreateTaskRow = ({ empty, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-lg border border-dashed px-4 py-5 text-center transition-all duration-200 ${
      empty
        ? 'border-blue-200 bg-blue-50/70 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm'
        : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
    }`}
  >
    <span className="mx-auto flex w-fit items-center gap-2 text-sm font-semibold text-blue-700">
      <PlusCircle className="h-4 w-4" />
      Tạo task {empty ? 'đầu tiên' : 'mới'}
    </span>
  </button>
);

export const AssistantTaskManagementPage = () => {
  const dispatch = useDispatch();
  const canCreateTask = useHasPermission(PERMISSIONS.ASSISTANT_TASK.CREATE);
  const tasks = useSelector(selectAssistantTasks);
  const meta = useSelector(selectAssistantTasksMeta);
  const loading = useSelector(selectAssistantTasksLoading);
  const saving = useSelector(selectAssistantTasksSaving);
  const error = useSelector(selectAssistantTasksError);
  const [monday, setMonday] = useState(() => mondayOf(new Date()));
  const [mode, setMode] = useState('regular');
  const [copied, setCopied] = useState(false);
  const [createPanelOpen, setCreatePanelOpen] = useState(false);

  const weekEnd = useMemo(() => addDays(monday, 6), [monday]);
  const params = useMemo(() => ({
    page: 1,
    limit: 100,
    startAt: isoStart(monday),
    endAt: isoEnd(weekEnd),
    includeProducts: true,
    isBaseTask: mode === 'base',
  }), [mode, monday, weekEnd]);

  const loadTasks = useCallback(() => dispatch(getAssistantTasksAsync(params)), [dispatch, params]);
  useEffect(() => { loadTasks(); }, [loadTasks]);

  const moveWeek = (offset) => setMonday((current) => addDays(current, offset * 7));
  const selectWeek = (value) => setMonday(mondayOf(value));
  const createTask = async (payload) => {
    await dispatch(createAssistantTaskAsync(payload)).unwrap();
    setCreatePanelOpen(false);
    await loadTasks();
  };
  const copyBaseTasks = async () => {
    if (!tasks.length) return;
    const header = ['Trợ giảng', 'Task name', 'Deadline', 'Hoàn thành thực tế', 'Task type', 'Status', 'Tên sản phẩm', 'Sản phẩm'];
    const rows = tasks.map((task) => {
      const assistant = task.assistant || task.admin;
      const products = task.products || [];
      return [
        assistant?.fullName || task.assistantName || (task.assistantId ? `Admin #${task.assistantId}` : 'Chưa gán'),
        task.taskName || `Task #${task.assistantTaskId}`,
        task.deadlineAt ? formatDateTime(task.deadlineAt) : '',
        task.completedAt ? formatDateTime(task.completedAt) : '',
        TASK_TYPE_LABELS[task.taskType] || task.taskType || '',
        STATUS_LABELS[task.status]?.[0] || task.status || '',
        products.map((product) => product.name || `Product #${product.assistantTaskProductId}`).join('; '),
        products.map((product) => {
          const marks = [
            product.examFileName ? 'có đề' : 'chưa có đề',
            product.examSolutionFileName ? 'có solution file' : 'chưa có solution file',
            product.solutionYoutubeUrl ? 'có YouTube' : 'chưa có YouTube',
          ].join(', ');
          return `${product.examName || (product.examId ? `Đề thi #${product.examId}` : 'Chưa gắn đề thi')} (${marks})`;
        }).join('; '),
      ];
    });
    await navigator.clipboard.writeText([header, ...rows].map((row) => row.join('\t')).join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex min-h-full flex-col gap-4 2xl:h-full 2xl:min-h-0 2xl:overflow-hidden">
      <div className="flex shrink-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">PHÂN CÔNG CÔNG VIỆC</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Task trợ giảng</h1>
          <p className="mt-1 text-sm text-foreground-light">Theo dõi task theo tuần, sản phẩm nộp và trạng thái hoàn thành.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setMonday(mondayOf(new Date()))}>Hôm nay</Button>
          <div className="flex items-center rounded-sm border border-border bg-white">
            <button type="button" aria-label="Tuần trước" onClick={() => moveWeek(-1)} className="p-2 hover:bg-gray-50"><ChevronLeft className="h-4 w-4" /></button>
            <span className="min-w-44 px-2 text-center text-sm font-medium">{weekRange(monday)}</span>
            <button type="button" aria-label="Tuần sau" onClick={() => moveWeek(1)} className="p-2 hover:bg-gray-50"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="flex rounded-sm border border-border bg-white p-0.5">
            <button type="button" onClick={() => setMode('regular')} className={`rounded px-3 py-1.5 text-xs font-medium ${mode === 'regular' ? 'bg-blue-600 text-white shadow-sm' : 'text-foreground-light hover:bg-gray-50'}`}>Bình thường</button>
            <button type="button" onClick={() => setMode('base')} className={`rounded px-3 py-1.5 text-xs font-medium ${mode === 'base' ? 'bg-indigo-600 text-white shadow-sm' : 'text-foreground-light hover:bg-gray-50'}`}>Cơ sở</button>
          </div>
          {mode === 'base' && (
            <Button variant="outline" size="sm" disabled={!tasks.length || loading} onClick={copyBaseTasks}>
              <Copy className="h-4 w-4" />
              {copied ? 'Đã copy' : 'Copy'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={loadTasks} loading={loading}><RefreshCw className="h-4 w-4" />Làm mới</Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Không thể tải danh sách task trợ giảng. Vui lòng thử lại.</div>}

      <div className="grid gap-5 2xl:min-h-0 2xl:flex-1 2xl:grid-cols-[288px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="font-semibold text-foreground">Chọn tuần</h2>
              <p className="text-xs text-foreground-light">Lọc theo deadlineAt của task.</p>
            </div>
          </div>
          <AssistantShiftMiniCalendar key={monday.toISOString()} selectedWeekStart={monday} onSelectWeek={selectWeek} />
          <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-xs text-foreground-light">
            <p className="font-semibold text-foreground">Khoảng gửi API</p>
            <p className="mt-1">startAt: {dayString(monday)}</p>
            <p>endAt: {dayString(weekEnd)}</p>
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">{mode === 'base' ? 'Task cơ sở' : 'Task bình thường'}</h2>
              <p className="text-xs text-foreground-light">Hiển thị {tasks.length} task{meta?.total ? ` / ${meta.total} tổng` : ''}</p>
            </div>
            {loading && <span className="text-xs font-medium text-blue-600">Đang tải...</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1440px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-light">Trợ giảng</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-light">Task name</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-light">Deadline</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-light">Hoàn thành thực tế</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-light">Task type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-light">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-light">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-light">Sản phẩm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={8} className="px-4 py-4"><div className="h-12 animate-pulse rounded-lg bg-gray-100" /></td>
                  </tr>
                )) : tasks.map((task) => (
                  <tr key={task.assistantTaskId} className="align-top hover:bg-gray-50/70">
                    <td className="px-4 py-3"><AssistantCell task={task} /></td>
                    <td className="px-4 py-3"><p className="max-w-[240px] text-sm font-semibold text-foreground">{task.taskName || `Task #${task.assistantTaskId}`}</p></td>
                    <td className="px-4 py-3"><p className="whitespace-nowrap text-sm font-medium text-foreground">{formatDateTime(task.deadlineAt)}</p></td>
                    <td className="px-4 py-3"><p className={`whitespace-nowrap text-sm font-medium ${task.completedAt ? 'text-emerald-700' : 'text-foreground-light'}`}>{formatDateTime(task.completedAt)}</p></td>
                    <td className="px-4 py-3"><span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{TASK_TYPE_LABELS[task.taskType] || task.taskType || '—'}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-3"><ProductNameCell products={task.products} /></td>
                    <td className="px-4 py-3"><ProductExamCell products={task.products} /></td>
                  </tr>
                ))}
                {!loading && tasks.length > 0 && canCreateTask && (
                  <tr className="group bg-slate-50 transition-colors hover:bg-blue-50">
                    <td colSpan={8} className="">
                      <CreateTaskRow onClick={() => setCreatePanelOpen(true)} />
                    </td>
                  </tr>
                )}
                {!loading && !tasks.length && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      {canCreateTask ? (
                        <CreateTaskRow empty onClick={() => setCreatePanelOpen(true)} />
                      ) : (
                        <>
                          <p className="text-base font-semibold text-foreground">Chưa có task trong tuần này</p>
                          <p className="mt-1 text-sm text-foreground-light">Thử đổi tuần hoặc chuyển giữa tab bình thường/cơ sở.</p>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {canCreateTask && (
        <AddTaskPanel
          key={`${mode}-${monday.toISOString()}-${createPanelOpen ? 'open' : 'closed'}`}
          open={createPanelOpen}
          onClose={() => setCreatePanelOpen(false)}
          monday={monday}
          mode={mode}
          saving={saving}
          onCreate={createTask}
        />
      )}
    </div>
  );
};
