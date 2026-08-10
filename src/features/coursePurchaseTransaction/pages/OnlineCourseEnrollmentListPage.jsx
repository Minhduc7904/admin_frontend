import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { courseEnrollmentApi } from '../../../core/api';
import { PERMISSIONS } from '../../../core/constants';
import { Button, Dropdown, Pagination, SearchInput, Table } from '../../../shared/components/ui';
import { useDebounce, useHasPermission } from '../../../shared/hooks';
import { addNotification } from '../../notification/store/notificationSlice';
import { CourseManualReconciliationModal } from '../components';

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'BLOCKED_UNPAID', label: 'Chờ thanh toán' },
  { value: 'ACTIVE', label: 'Đang học' },
  { value: 'COMPLETED', label: 'Đã hoàn thành' },
  { value: 'DROPPED', label: 'Đã dừng' },
];

const statusLabels = { BLOCKED_UNPAID: 'Chờ thanh toán', ACTIVE: 'Đang học', COMPLETED: 'Đã hoàn thành', DROPPED: 'Đã dừng' };
const statusClasses = { BLOCKED_UNPAID: 'bg-amber-100 text-amber-800', ACTIVE: 'bg-emerald-100 text-emerald-800', COMPLETED: 'bg-blue-100 text-blue-800', DROPPED: 'bg-gray-100 text-gray-700' };
const formatMoney = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));
const formatDateTime = (value) => value ? new Date(value).toLocaleString('vi-VN') : '-';

export const OnlineCourseEnrollmentListPage = () => {
  const dispatch = useDispatch();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'BLOCKED_UNPAID' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const debouncedSearch = useDebounce(filters.search, 400);
  const canConfirm = useHasPermission(PERMISSIONS.COURSE_ENROLLMENT.UPDATE);
  const canSearchTransactions = useHasPermission(PERMISSIONS.BANK_TRANSFER_TRANSACTION.GET_ALL);
  const canReconcile = canConfirm && canSearchTransactions;

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await courseEnrollmentApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch.trim() || undefined,
        status: filters.status || undefined,
        type: 'ONLINE_PURCHASE',
        sortBy: 'enrolledAt',
        sortOrder: 'desc',
      });
      const data = response?.data?.data ?? response?.data ?? [];
      const meta = response?.data?.meta ?? {};
      setEnrollments(data);
      setPagination((current) => ({ ...current, total: meta.total ?? data.length, totalPages: meta.totalPages ?? 1 }));
    } catch (error) {
      setEnrollments([]);
      dispatch(addNotification({ type: 'error', title: 'Không thể tải danh sách đăng ký mua khóa học online', message: error?.data?.message || error?.message, autoHide: true }));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, dispatch, filters.status, pagination.limit, pagination.page]);

  useEffect(() => { loadEnrollments(); }, [loadEnrollments]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const confirmManualReconciliation = async (enrollment, transaction) => {
    setReconciling(true);
    try {
      await courseEnrollmentApi.confirmManualPayment(enrollment.enrollmentId, { bankTransferTransactionId: transaction.bankTransferTransactionId });
      setSelectedEnrollment(null);
      await loadEnrollments();
      dispatch(addNotification({ type: 'success', title: 'Đã đối soát thanh toán khóa học', autoHide: true }));
    } catch (error) {
      dispatch(addNotification({ type: 'error', title: 'Không thể đối soát thanh toán khóa học', message: error?.data?.message || error?.message, autoHide: true }));
    } finally {
      setReconciling(false);
    }
  };

  const columns = useMemo(() => [
    { key: 'enrollmentId', label: 'Enrollment', render: (row) => <span className="font-medium">#{row.enrollmentId}</span> },
    { key: 'course', label: 'Khóa học', render: (row) => <div><p className="font-medium text-foreground">{row.course?.title || `Khóa học #${row.courseId}`}</p><p className="text-xs text-foreground-light">{formatMoney(row.course?.priceVND)}</p></div> },
    { key: 'student', label: 'Học sinh', render: (row) => <div><p className="font-medium text-foreground">{row.student?.fullName || `Học sinh #${row.studentId}`}</p><p className="text-xs text-foreground-light">#{row.studentId}</p></div> },
    { key: 'status', label: 'Trạng thái', render: (row) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClasses[row.status] || 'bg-gray-100 text-gray-700'}`}>{statusLabels[row.status] || row.status}</span> },
    { key: 'enrolledAt', label: 'Thời gian đăng ký', render: (row) => formatDateTime(row.enrolledAt) },
    { key: 'actions', label: '', align: 'right', render: (row) => canReconcile && row.status === 'BLOCKED_UNPAID' ? <Button size="sm" variant="outline" onClick={() => setSelectedEnrollment(row)}><ShieldCheck className="h-4 w-4" /> Đối soát</Button> : '-' },
  ], [canReconcile]);

  return <div className="space-y-5 p-4 sm:p-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-foreground-light">MUA KHÓA HỌC ONLINE</p><h1 className="mt-1 text-2xl font-bold text-foreground">Đăng ký mua khóa học online</h1><p className="mt-1 text-sm text-foreground-light">Theo dõi enrollment mua online và đối soát thủ công từng đăng ký đang chờ thanh toán.</p></div>
      <Button variant="outline" onClick={loadEnrollments} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới</Button>
    </div>
    <div className="grid gap-3 rounded-xl border border-border bg-white p-4 md:grid-cols-[minmax(0,1fr)_220px]">
      <SearchInput value={filters.search} onChange={(value) => updateFilter('search', value)} placeholder="Tìm học sinh hoặc khóa học..." />
      <Dropdown value={filters.status} onChange={(value) => updateFilter('status', value)} options={statusOptions} />
    </div>
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <Table columns={columns} data={enrollments} loading={loading} emptyMessage="Không có đăng ký mua khóa học online" emptySubMessage="Thử thay đổi điều kiện lọc hoặc làm mới dữ liệu." />
      <Pagination currentPage={pagination.page} totalPages={Math.max(1, pagination.totalPages)} totalItems={pagination.total} itemsPerPage={pagination.limit} disabled={loading} onPageChange={(page) => setPagination((current) => ({ ...current, page }))} onItemsPerPageChange={(limit) => setPagination((current) => ({ ...current, page: 1, limit: Number(limit) }))} />
    </div>
    <CourseManualReconciliationModal isOpen={Boolean(selectedEnrollment)} onClose={() => !reconciling && setSelectedEnrollment(null)} onConfirm={confirmManualReconciliation} loading={reconciling} canSearchTransactions={canSearchTransactions} initialEnrollment={selectedEnrollment} />
  </div>;
};
