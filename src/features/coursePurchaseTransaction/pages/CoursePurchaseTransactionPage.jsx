import { useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { courseEnrollmentApi } from '../../../core/api';
import { PERMISSIONS } from '../../../core/constants';
import { Button } from '../../../shared/components/ui';
import { useHasPermission } from '../../../shared/hooks';
import { addNotification } from '../../notification/store/notificationSlice';
import { BankTransferTransactionListPage } from '../../bankTransferTransaction/pages';
import { CourseManualReconciliationModal } from '../components';

export const CoursePurchaseTransactionPage = () => {
  const dispatch = useDispatch();
  const refreshTransactionsRef = useRef(null);
  const [manualReconciliationOpen, setManualReconciliationOpen] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const canViewEnrollments = useHasPermission(PERMISSIONS.COURSE_ENROLLMENT.GET_ALL);
  const canConfirm = useHasPermission(PERMISSIONS.COURSE_ENROLLMENT.UPDATE);
  const canSearchTransactions = useHasPermission(PERMISSIONS.BANK_TRANSFER_TRANSACTION.GET_ALL);
  const canReconcile = canViewEnrollments && canConfirm && canSearchTransactions;

  const confirmManualReconciliation = async (enrollment, transaction) => {
    setReconciling(true);
    try {
      await courseEnrollmentApi.confirmManualPayment(enrollment.enrollmentId, {
        bankTransferTransactionId: transaction.bankTransferTransactionId,
      });
      setManualReconciliationOpen(false);
      await refreshTransactionsRef.current?.();
      dispatch(addNotification({ type: 'success', title: 'Đã đối soát thanh toán khóa học', autoHide: true }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Không thể đối soát thanh toán khóa học',
        message: error?.data?.message || error?.message,
        autoHide: true,
      }));
    } finally {
      setReconciling(false);
    }
  };

  return <>
    <BankTransferTransactionListPage
      defaultType="COURSE_PURCHASE"
      sectionLabel="MUA KHÓA HỌC"
      title="Giao dịch mua khóa học"
      description="Theo dõi giao dịch SePay và đối soát thanh toán mua khóa học online."
      onRefreshReady={(refresh) => { refreshTransactionsRef.current = refresh; }}
      headerActions={canReconcile ? <Button variant="outline" onClick={() => setManualReconciliationOpen(true)}><ShieldCheck className="h-4 w-4" /> Đối soát thủ công</Button> : null}
    />
    <CourseManualReconciliationModal
      isOpen={manualReconciliationOpen}
      onClose={() => setManualReconciliationOpen(false)}
      onConfirm={confirmManualReconciliation}
      loading={reconciling}
      canSearchTransactions={canSearchTransactions}
    />
  </>;
};
