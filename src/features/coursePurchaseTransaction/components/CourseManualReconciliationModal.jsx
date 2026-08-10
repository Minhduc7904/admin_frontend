import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button, Modal, SearchInput } from '../../../shared/components/ui';
import { NoPermission } from '../../../shared/components/permissions';
import { useDebounce } from '../../../shared/hooks';
import { courseEnrollmentApi } from '../../../core/api';
import { BankTransferTransactionSearch } from '../../bankTransferTransaction/components';

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const CourseManualReconciliationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  canSearchTransactions,
  initialEnrollment = null,
}) => {
  const [search, setSearch] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const debouncedSearch = useDebounce(search, 400);
  const enrollmentLocked = Boolean(initialEnrollment);

  useEffect(() => {
    if (!isOpen || enrollmentLocked) return undefined;

    let active = true;
    const loadEnrollments = async () => {
      setLoadingEnrollments(true);
      try {
        const response = await courseEnrollmentApi.getAll({
          page: 1,
          limit: 20,
          search: debouncedSearch.trim() || undefined,
          type: 'ONLINE_PURCHASE',
          status: 'BLOCKED_UNPAID',
          sortBy: 'enrolledAt',
          sortOrder: 'desc',
        });
        if (active) setEnrollments(response?.data?.data ?? response?.data ?? []);
      } catch {
        if (active) setEnrollments([]);
      } finally {
        if (active) setLoadingEnrollments(false);
      }
    };

    loadEnrollments();
    return () => { active = false; };
  }, [debouncedSearch, enrollmentLocked, isOpen]);

  useEffect(() => {
    if (isOpen && initialEnrollment) {
      setSelectedEnrollment(initialEnrollment);
      setSelectedTransaction(null);
      return;
    }

    if (!isOpen) {
      setSearch('');
      setSelectedEnrollment(null);
      setSelectedTransaction(null);
    }
  }, [initialEnrollment, isOpen]);

  const selectedLabel = useMemo(() => selectedEnrollment && (
    `${selectedEnrollment.course?.title || `Khóa học #${selectedEnrollment.courseId}`} · ${selectedEnrollment.student?.fullName || `Học sinh #${selectedEnrollment.studentId}`}`
  ), [selectedEnrollment]);

  const selectEnrollment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setSelectedTransaction(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedEnrollment || !selectedTransaction) return;
    await onConfirm(selectedEnrollment, selectedTransaction);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !loading && onClose()} title="Đối soát thủ công mua khóa học" size="6xl" customContent>
      <form onSubmit={submit} className="flex max-h-[calc(100vh-8rem)] flex-col">
        <div className="grid min-h-0 gap-5 overflow-y-auto p-5 lg:grid-cols-2">
          <section className="min-h-0 rounded-xl border border-border bg-white">
            <div className="border-b border-border p-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-5 w-5 text-blue-700" />
                <div>
                  <h3 className="font-semibold text-foreground">1. {enrollmentLocked ? 'Đăng ký mua khóa học đã chọn' : 'Chọn đăng ký mua khóa học'}</h3>
                  <p className="mt-1 text-xs text-foreground-light">{enrollmentLocked ? 'Enrollment được chọn từ trang quản lý đăng ký mua online.' : 'Chỉ hiển thị enrollment mua online đang chờ thanh toán.'}</p>
                </div>
              </div>
              {!enrollmentLocked && <div className="mt-3"><SearchInput value={search} onChange={setSearch} placeholder="Tìm học sinh hoặc khóa học..." /></div>}
            </div>
            <div className="max-h-[440px] space-y-2 overflow-y-auto p-3">
              {enrollmentLocked && selectedEnrollment && <EnrollmentCard enrollment={selectedEnrollment} selected />}
              {!enrollmentLocked && loadingEnrollments && <p className="p-3 text-sm text-foreground-light">Đang tải enrollment...</p>}
              {!enrollmentLocked && !loadingEnrollments && enrollments.length === 0 && <p className="p-3 text-sm text-foreground-light">Không tìm thấy enrollment mua khóa học đang chờ thanh toán.</p>}
              {!enrollmentLocked && !loadingEnrollments && enrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.enrollmentId}
                  enrollment={enrollment}
                  selected={selectedEnrollment?.enrollmentId === enrollment.enrollmentId}
                  onClick={() => selectEnrollment(enrollment)}
                />
              ))}
            </div>
          </section>

          {selectedEnrollment ? (
            <section className="space-y-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-amber-700" /><div><h3 className="font-semibold text-amber-900">2. Chọn giao dịch SePay</h3><p className="mt-1 text-sm text-amber-800">Chỉ có thể đối soát giao dịch mua khóa học hoặc chưa phân loại, đúng tài khoản và số tiền.</p></div></div>
                <p className="mt-3 text-sm font-medium text-amber-900">{selectedLabel}</p>
              </div>
              {canSearchTransactions ? <BankTransferTransactionSearch
                selectedIds={selectedTransaction ? [selectedTransaction.bankTransferTransactionId] : []}
                onToggle={(transaction) => setSelectedTransaction((current) => current?.bankTransferTransactionId === transaction.bankTransferTransactionId ? null : transaction)}
                initialSearch={`CE${selectedEnrollment.enrollmentId}`}
                initialReconciliationStatus="UNRECONCILED"
                allowedTransactionTypes={['COURSE_PURCHASE', 'UNCLASSIFIED']}
              /> : <NoPermission variant="card" message="Bạn không có quyền xem giao dịch ngân hàng để đối soát." />}
            </section>
          ) : <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground-light">Chọn enrollment trước để tìm giao dịch phù hợp.</div>}
        </div>
        <div className="flex justify-end gap-3 border-t border-border p-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
          <Button type="submit" loading={loading} disabled={!selectedEnrollment || !selectedTransaction}><CheckCircle2 className="h-4 w-4" /> Xác nhận đối soát</Button>
        </div>
      </form>
    </Modal>
  );
};

const EnrollmentCard = ({ enrollment, selected, onClick }) => {
  const content = <>
    <p className="font-semibold text-foreground">{enrollment.course?.title || `Khóa học #${enrollment.courseId}`}</p>
    <p className="mt-1 text-sm text-foreground-light">{enrollment.student?.fullName || `Học sinh #${enrollment.studentId}`}</p>
    <p className="mt-1 text-xs text-foreground-light">Enrollment #{enrollment.enrollmentId} · {enrollment.course?.priceVND !== undefined ? formatMoney(enrollment.course.priceVND) : 'Chờ kiểm tra số tiền'}</p>
  </>;

  if (!onClick) return <div className="rounded-lg border border-foreground bg-slate-50 p-3">{content}</div>;

  return <button type="button" onClick={onClick} className={`w-full rounded-lg border p-3 text-left transition ${selected ? 'border-foreground bg-slate-50 ring-1 ring-foreground' : 'border-border hover:border-foreground-light hover:bg-gray-50'}`}>{content}</button>;
};
