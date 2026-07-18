import { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Banknote,
    CheckCircle2,
    Clock3,
    Eye,
    FileText,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    XCircle,
} from 'lucide-react';
import { onlineCourseInvoiceApi } from '../../../core/api';
import { PERMISSIONS } from '../../../core/constants';
import { useHasPermission } from '../../../shared/hooks';
import {
    ActionMenu,
    Button,
    ConfirmModal,
    Dropdown,
    Input,
    Modal,
    Pagination,
    SearchInput,
    Table,
    Textarea,
    RightPanel,
} from '../../../shared/components/ui';

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
    { value: 'PAYMENT_FAILED', label: 'Thanh toán lỗi' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'EXPIRED', label: 'Hết hạn' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền' },
    { value: 'PARTIALLY_REFUNDED', label: 'Hoàn tiền một phần' },
];

const PROVIDER_OPTIONS = [
    { value: '', label: 'Tất cả cổng thanh toán' },
    { value: 'BANK_TRANSFER', label: 'Bank transfer' },
    { value: 'VNPAY', label: 'VNPay' },
    { value: 'MOMO', label: 'MoMo' },
    { value: 'ZALOPAY', label: 'ZaloPay' },
    { value: 'PAYOS', label: 'PayOS' },
    { value: 'STRIPE', label: 'Stripe' },
    { value: 'OTHER', label: 'Khác' },
];

const QUICK_FILTERS = [
    { label: 'Chờ đối soát', status: 'PENDING_PAYMENT', paymentProvider: '' },
    { label: 'Thanh toán lỗi', status: 'PAYMENT_FAILED', paymentProvider: '' },
    { label: 'Bank transfer', status: '', paymentProvider: 'BANK_TRANSFER' },
    { label: 'Đã thanh toán', status: 'PAID', paymentProvider: '' },
];

const canConfirmInvoice = (invoice) =>
    ['PENDING_PAYMENT', 'PAYMENT_FAILED'].includes(invoice?.status);

const getResponseData = (response) => response?.data?.data ?? response?.data ?? response;
const getResponseMeta = (response) => response?.data?.meta ?? {};

const formatMoney = (value, currency = 'VND') => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency,
    }).format(Number(value));
};

const formatDateTime = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
};

const toIsoFromLocalDateTime = (value) => {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const StatusBadge = ({ status }) => {
    const config = {
        PENDING_PAYMENT: {
            label: 'Chờ thanh toán',
            className: 'bg-amber-100 text-amber-700',
            icon: Clock3,
        },
        PAYMENT_FAILED: {
            label: 'Thanh toán lỗi',
            className: 'bg-red-100 text-red-700',
            icon: XCircle,
        },
        PAID: {
            label: 'Đã thanh toán',
            className: 'bg-emerald-100 text-emerald-700',
            icon: CheckCircle2,
        },
        CANCELLED: {
            label: 'Đã hủy',
            className: 'bg-gray-100 text-gray-700',
            icon: XCircle,
        },
        EXPIRED: {
            label: 'Hết hạn',
            className: 'bg-slate-100 text-slate-700',
            icon: Clock3,
        },
        REFUNDED: {
            label: 'Đã hoàn tiền',
            className: 'bg-blue-100 text-blue-700',
            icon: RefreshCw,
        },
        PARTIALLY_REFUNDED: {
            label: 'Hoàn tiền một phần',
            className: 'bg-indigo-100 text-indigo-700',
            icon: RefreshCw,
        },
    };

    const badge = config[status] || {
        label: status || '-',
        className: 'bg-gray-100 text-gray-700',
        icon: FileText,
    };
    const Icon = badge.icon;

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
            <Icon className="h-3 w-3" />
            {badge.label}
        </span>
    );
};

const StatCard = ({ label, value, helper, icon: Icon, tone = 'gray' }) => {
    const tones = {
        gray: 'bg-gray-50 text-gray-700',
        amber: 'bg-amber-50 text-amber-700',
        emerald: 'bg-emerald-50 text-emerald-700',
        blue: 'bg-blue-50 text-blue-700',
    };

    return (
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-wide text-foreground-light">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">
                        {value}
                    </p>
                    {helper && (
                        <p className="mt-1 text-xs text-foreground-light">{helper}</p>
                    )}
                </div>
                <div className={`rounded-lg p-2 ${tones[tone] || tones.gray}`}>
                    {createElement(Icon, { className: 'h-5 w-5' })}
                </div>
            </div>
        </div>
    );
};

const ConfirmBankTransferModal = ({ invoice, isOpen, onClose, onConfirm, loading }) => {
    const [formData, setFormData] = useState(() => ({
        paidAmount: invoice?.totalAmount ?? '',
        paidAt: '',
        bankCode: '',
        bankTranNo: '',
        transactionId: '',
        note: '',
        bankAccount: '',
        statementLine: '',
    }));

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const metadata = {};
        if (formData.bankAccount.trim()) metadata.bankAccount = formData.bankAccount.trim();
        if (formData.statementLine.trim()) metadata.statementLine = formData.statementLine.trim();

        onConfirm({
            paidAmount: formData.paidAmount === '' ? undefined : Number(formData.paidAmount),
            paidAt: toIsoFromLocalDateTime(formData.paidAt),
            bankCode: formData.bankCode.trim() || undefined,
            bankTranNo: formData.bankTranNo.trim() || undefined,
            transactionId: formData.transactionId.trim() || undefined,
            note: formData.note.trim() || undefined,
            metadata: Object.keys(metadata).length ? metadata : undefined,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Xác nhận chuyển khoản thủ công"
            size="2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-800">
                        Chỉ xác nhận khi đã đối soát tiền trong sao kê ngân hàng.
                    </p>
                    <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                        <p className="text-amber-700">
                            Mã hóa đơn:{' '}
                            <span className="font-semibold">{invoice?.invoiceCode}</span>
                        </p>
                        <p className="text-amber-700">
                            Tổng tiền:{' '}
                            <span className="font-semibold">
                                {formatMoney(invoice?.totalAmount, invoice?.currency)}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        name="paidAmount"
                        label="Số tiền đã thanh toán"
                        type="number"
                        required
                        value={formData.paidAmount}
                        onChange={handleChange}
                        helperText="Backend yêu cầu số tiền bằng tổng tiền hóa đơn"
                    />
                    <Input
                        name="paidAt"
                        label="Thời điểm thanh toán"
                        type="datetime-local"
                        value={formData.paidAt}
                        onChange={handleChange}
                        helperText="Để trống để backend dùng thời gian hiện tại"
                    />
                    <Input
                        name="bankCode"
                        label="Mã ngân hàng"
                        placeholder="VD: VCB, TCB"
                        value={formData.bankCode}
                        onChange={handleChange}
                    />
                    <Input
                        name="bankTranNo"
                        label="Mã giao dịch ngân hàng"
                        placeholder="VD: FT251234567"
                        value={formData.bankTranNo}
                        onChange={handleChange}
                    />
                    <Input
                        name="transactionId"
                        label="Mã giao dịch đối soát"
                        value={formData.transactionId}
                        onChange={handleChange}
                    />
                    <Input
                        name="bankAccount"
                        label="Tài khoản nhận"
                        value={formData.bankAccount}
                        onChange={handleChange}
                    />
                </div>

                <Textarea
                    name="statementLine"
                    label="Dòng sao kê"
                    rows={2}
                    maxLength={500}
                    value={formData.statementLine}
                    onChange={handleChange}
                    placeholder="VD: INV_123 Nguyen Van A"
                />
                <Textarea
                    name="note"
                    label="Ghi chú xác nhận"
                    rows={3}
                    maxLength={500}
                    value={formData.note}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-3 border-t border-border pt-4">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" loading={loading}>
                        <ShieldCheck className="h-4 w-4" />
                        Xác nhận đã chuyển khoản
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

const InvoiceDetailPanel = ({ invoice, loading, onConfirm, onDelete, canDelete }) => {
    if (loading) {
        return (
            <div className="p-6 text-sm text-foreground-light">
                Đang tải chi tiết hóa đơn...
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="p-6 text-sm text-foreground-light">
                Chưa chọn hóa đơn
            </div>
        );
    }

    const itemColumns = [
        {
            key: 'courseTitle',
            label: 'Khóa học',
            render: (item) => (
                <div>
                    <p className="font-medium text-foreground">{item.courseTitle || '-'}</p>
                    <p className="text-xs text-foreground-light">
                        #{item.courseId || '-'} · {item.courseCode || 'Không có mã'}
                    </p>
                </div>
            ),
        },
        {
            key: 'quantity',
            label: 'SL',
            align: 'center',
            render: (item) => item.quantity ?? 1,
        },
        {
            key: 'totalAmount',
            label: 'Thành tiền',
            align: 'right',
            render: (item) => formatMoney(item.totalAmount, invoice.currency),
        },
        {
            key: 'enrollmentId',
            label: 'Enrollment',
            align: 'center',
            render: (item) => item.enrollmentId ? `#${item.enrollmentId}` : '-',
        },
    ];

    const attemptColumns = [
        { key: 'attemptCode', label: 'Attempt' },
        { key: 'provider', label: 'Provider' },
        { key: 'status', label: 'Status' },
        {
            key: 'amount',
            label: 'Số tiền',
            render: (attempt) => formatMoney(attempt.amount, attempt.currency || invoice.currency),
        },
        {
            key: 'bank',
            label: 'Ngân hàng',
            render: (attempt) => (
                <span className="text-sm text-foreground-light">
                    {attempt.providerBankCode || '-'} / {attempt.providerBankTranNo || '-'}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-5 p-1">
            <div className="rounded-xl border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-foreground-light">
                            Mã hóa đơn
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-foreground">
                            {invoice.invoiceCode}
                        </h2>
                    </div>
                    <StatusBadge status={invoice.status} />
                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <InfoLine label="Invoice ID" value={`#${invoice.invoiceId}`} />
                    <InfoLine label="Học sinh" value={invoice.studentId ? `#${invoice.studentId}` : '-'} />
                    <InfoLine label="Người mua" value={invoice.buyerUserId ? `#${invoice.buyerUserId}` : '-'} />
                    <InfoLine label="Provider" value={invoice.paymentProvider || '-'} />
                    <InfoLine label="Tổng tiền" value={formatMoney(invoice.totalAmount, invoice.currency)} />
                    <InfoLine label="Đã thanh toán" value={formatMoney(invoice.paidAmount, invoice.currency)} />
                    <InfoLine label="Ngày tạo" value={formatDateTime(invoice.createdAt)} />
                    <InfoLine label="Ngày thanh toán" value={formatDateTime(invoice.paidAt)} />
                    <InfoLine
                        label="Enrollment"
                        value={invoice.enrollmentCreated ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                    />
                    <InfoLine label="Hết hạn" value={formatDateTime(invoice.expiresAt)} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {canConfirmInvoice(invoice) ? (
                        <Button onClick={() => onConfirm(invoice)}>
                            <Banknote className="h-4 w-4" />
                            Xác nhận chuyển khoản
                        </Button>
                    ) : (
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Không cần xác nhận thủ công
                        </div>
                    )}
                    {canDelete && <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => onDelete(invoice)}>
                        <Trash2 className="h-4 w-4" />
                        Xóa hóa đơn
                    </Button>}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-white">
                <div className="border-b border-border px-4 py-3">
                    <h3 className="font-semibold text-foreground">Khóa học trong hóa đơn</h3>
                </div>
                <Table
                    columns={itemColumns}
                    data={invoice.items || []}
                    emptyMessage="Hóa đơn chưa có item"
                />
            </div>

            <div className="rounded-xl border border-border bg-white">
                <div className="border-b border-border px-4 py-3">
                    <h3 className="font-semibold text-foreground">Lịch sử payment attempts</h3>
                </div>
                <Table
                    columns={attemptColumns}
                    data={invoice.paymentAttempts || (invoice.latestAttempt ? [invoice.latestAttempt] : [])}
                    emptyMessage="Chưa có payment attempt"
                />
            </div>
        </div>
    );
};

const InfoLine = ({ label, value }) => (
    <div className="rounded-sm bg-gray-50 p-3">
        <p className="text-xs text-foreground-light">{label}</p>
        <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
);

export const OnlineCourseInvoiceListPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [meta, setMeta] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });
    const [filters, setFilters] = useState({
        search: '',
        invoiceCode: '',
        status: 'PENDING_PAYMENT',
        paymentProvider: '',
        fromDate: '',
        toDate: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailInvoice, setDetailInvoice] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [confirmInvoice, setConfirmInvoice] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [deleteInvoice, setDeleteInvoice] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const canDeleteInvoice = useHasPermission(PERMISSIONS.ONLINE_COURSE_INVOICE.DELETE);

    const queryParams = useMemo(() => ({
        page: meta.page,
        limit: meta.limit,
        search: filters.search || undefined,
        invoiceCode: filters.invoiceCode || undefined,
        status: filters.status || undefined,
        paymentProvider: filters.paymentProvider || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
    }), [filters, meta.limit, meta.page]);

    const loadInvoices = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await onlineCourseInvoiceApi.getAdminList(queryParams);
            setInvoices(getResponseData(response) || []);
            setMeta((prev) => ({ ...prev, ...getResponseMeta(response) }));
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không tải được danh sách hóa đơn');
        } finally {
            setLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);

    const updateFilter = (payload) => {
        setMeta((prev) => ({ ...prev, page: 1 }));
        setFilters((prev) => ({ ...prev, ...payload }));
    };

    const handleViewDetail = async (invoice) => {
        setDetailOpen(true);
        setDetailInvoice(invoice);
        setLoadingDetail(true);
        setError('');
        try {
            const response = await onlineCourseInvoiceApi.getAdminDetail(invoice.invoiceId);
            setDetailInvoice(getResponseData(response));
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không tải được chi tiết hóa đơn');
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleConfirmBankTransfer = async (payload) => {
        if (!confirmInvoice) return;

        setConfirmLoading(true);
        setError('');
        try {
            const response = await onlineCourseInvoiceApi.confirmBankTransfer(
                confirmInvoice.invoiceId,
                payload
            );
            const result = getResponseData(response);
            const updatedInvoice = result?.invoice || result;
            setConfirmInvoice(null);
            setDetailInvoice(updatedInvoice);
            await loadInvoices();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Xác nhận chuyển khoản thất bại');
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleDeleteInvoice = async () => {
        if (!deleteInvoice?.invoiceId) return;
        setDeleteLoading(true);
        setError('');
        try {
            await onlineCourseInvoiceApi.deleteAdminInvoice(deleteInvoice.invoiceId);
            if (detailInvoice?.invoiceId === deleteInvoice.invoiceId) {
                setDetailOpen(false);
                setDetailInvoice(null);
            }
            setDeleteInvoice(null);
            await loadInvoices();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể xóa hóa đơn');
        } finally {
            setDeleteLoading(false);
        }
    };

    const stats = useMemo(() => {
        const pending = invoices.filter((item) => item.status === 'PENDING_PAYMENT').length;
        const failed = invoices.filter((item) => item.status === 'PAYMENT_FAILED').length;
        const paid = invoices.filter((item) => item.status === 'PAID').length;
        const amount = invoices.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);

        return { pending, failed, paid, amount };
    }, [invoices]);

    const columns = [
        {
            key: 'invoiceCode',
            label: 'Hóa đơn',
            render: (invoice) => (
                <div>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleViewDetail(invoice);
                        }}
                        className="font-semibold text-foreground hover:underline"
                    >
                        {invoice.invoiceCode}
                    </button>
                    <p className="text-xs text-foreground-light">#{invoice.invoiceId}</p>
                </div>
            ),
        },
        {
            key: 'buyer',
            label: 'Người mua',
            render: (invoice) => (
                <div className="text-sm">
                    <p className="text-foreground">Student #{invoice.studentId || '-'}</p>
                    <p className="text-xs text-foreground-light">Buyer #{invoice.buyerUserId || '-'}</p>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (invoice) => <StatusBadge status={invoice.status} />,
        },
        {
            key: 'amount',
            label: 'Số tiền',
            render: (invoice) => (
                <div>
                    <p className="font-semibold text-foreground">
                        {formatMoney(invoice.totalAmount, invoice.currency)}
                    </p>
                    <p className="text-xs text-foreground-light">
                        Đã thu: {formatMoney(invoice.paidAmount, invoice.currency)}
                    </p>
                </div>
            ),
        },
        {
            key: 'paymentProvider',
            label: 'Provider',
            render: (invoice) => (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {invoice.paymentProvider || 'Chưa có'}
                </span>
            ),
        },
        {
            key: 'items',
            label: 'Khóa',
            align: 'center',
            render: (invoice) => invoice.items?.length || 0,
        },
        {
            key: 'enrollmentCreated',
            label: 'Kích hoạt',
            align: 'center',
            render: (invoice) => invoice.enrollmentCreated ? (
                <span className="text-emerald-600">Đã tạo</span>
            ) : (
                <span className="text-foreground-light">Chưa</span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (invoice) => (
                <div className="text-sm">
                    <p>{formatDateTime(invoice.createdAt)}</p>
                    <p className="text-xs text-foreground-light">
                        Paid: {formatDateTime(invoice.paidAt)}
                    </p>
                </div>
            ),
        },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (invoice) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Xem chi tiết',
                            icon: <Eye size={14} />,
                            onClick: () => handleViewDetail(invoice),
                        },
                        ...(canConfirmInvoice(invoice)
                            ? [{
                                label: 'Xác nhận chuyển khoản',
                                icon: <Banknote size={14} />,
                                onClick: () => setConfirmInvoice(invoice),
                            }]
                            : []),
                        ...(canDeleteInvoice
                            ? [{
                                label: 'Xóa hóa đơn',
                                icon: <Trash2 size={14} />,
                                variant: 'danger',
                                onClick: () => setDeleteInvoice(invoice),
                            }]
                            : []),
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-medium text-amber-600">Online course</p>
                    <h1 className="text-2xl font-bold text-foreground">
                        Quản lý hóa đơn mua khóa học
                    </h1>
                    <p className="mt-1 text-sm text-foreground-light">
                        Đối soát chuyển khoản thủ công, xác nhận thanh toán và kích hoạt CourseEnrollment.
                    </p>
                </div>
                <Button variant="outline" onClick={loadInvoices} disabled={loading}>
                    <RefreshCw className="h-4 w-4" />
                    Tải lại
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard label="Chờ đối soát" value={stats.pending} icon={Clock3} tone="amber" />
                <StatCard label="Thanh toán lỗi" value={stats.failed} icon={XCircle} tone="gray" />
                <StatCard label="Đã thanh toán" value={stats.paid} icon={CheckCircle2} tone="emerald" />
                <StatCard
                    label="Giá trị trang hiện tại"
                    value={formatMoney(stats.amount)}
                    helper={`${invoices.length} hóa đơn đang hiển thị`}
                    icon={Banknote}
                    tone="blue"
                />
            </div>

            {error && (
                <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="rounded-xl border border-border bg-white shadow-sm">
                <div className="space-y-4 border-b border-border p-4">
                    <div className="flex flex-wrap gap-2">
                        {QUICK_FILTERS.map((item) => (
                            <button
                                key={`${item.label}-${item.status}-${item.paymentProvider}`}
                                type="button"
                                onClick={() => updateFilter({
                                    status: item.status,
                                    paymentProvider: item.paymentProvider,
                                })}
                                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                                    filters.status === item.status &&
                                    filters.paymentProvider === item.paymentProvider
                                        ? 'border-foreground bg-foreground text-white'
                                        : 'border-border bg-white text-foreground-light hover:text-foreground'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-3 xl:grid-cols-[1.4fr_180px_180px_180px_170px_170px]">
                        <SearchInput
                            value={filters.search}
                            onChange={(value) => updateFilter({ search: value })}
                            placeholder="Tìm invoice, course, provider order..."
                        />
                        <Input
                            name="invoiceCode"
                            value={filters.invoiceCode}
                            onChange={(event) => updateFilter({ invoiceCode: event.target.value })}
                            placeholder="Mã hóa đơn"
                        />
                        <Dropdown
                            value={filters.status}
                            onChange={(value) => updateFilter({ status: value })}
                            options={STATUS_OPTIONS}
                        />
                        <Dropdown
                            value={filters.paymentProvider}
                            onChange={(value) => updateFilter({ paymentProvider: value })}
                            options={PROVIDER_OPTIONS}
                        />
                        <Input
                            name="fromDate"
                            type="date"
                            value={filters.fromDate}
                            onChange={(event) => updateFilter({ fromDate: event.target.value })}
                        />
                        <Input
                            name="toDate"
                            type="date"
                            value={filters.toDate}
                            onChange={(event) => updateFilter({ toDate: event.target.value })}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={invoices}
                    loading={loading}
                    emptyMessage="Không có hóa đơn nào"
                    emptySubMessage="Thử đổi bộ lọc hoặc tải lại dữ liệu."
                    emptyIcon="file-text"
                    onRowClick={handleViewDetail}
                />

                <div className="border-t border-border p-4">
                    <Pagination
                        currentPage={meta.page || 1}
                        totalPages={meta.totalPages || 1}
                        totalItems={meta.total || 0}
                        itemsPerPage={meta.limit || 10}
                        onPageChange={(page) => setMeta((prev) => ({ ...prev, page }))}
                        onItemsPerPageChange={(limit) =>
                            setMeta((prev) => ({ ...prev, page: 1, limit: Number(limit) }))
                        }
                        disabled={loading}
                    />
                </div>
            </div>

            <RightPanel
                isOpen={detailOpen}
                onClose={() => {
                    setDetailOpen(false);
                    setDetailInvoice(null);
                }}
                title="Chi tiết hóa đơn khóa học"
                width="w-[860px]"
            >
                <InvoiceDetailPanel
                    invoice={detailInvoice}
                    loading={loadingDetail}
                    onConfirm={setConfirmInvoice}
                    onDelete={setDeleteInvoice}
                    canDelete={canDeleteInvoice}
                />
            </RightPanel>

            {confirmInvoice && (
                <ConfirmBankTransferModal
                    key={confirmInvoice.invoiceId}
                    invoice={confirmInvoice}
                    isOpen={Boolean(confirmInvoice)}
                    onClose={() => setConfirmInvoice(null)}
                    onConfirm={handleConfirmBankTransfer}
                    loading={confirmLoading}
                />
            )}

            <ConfirmModal
                isOpen={Boolean(deleteInvoice)}
                onClose={() => setDeleteInvoice(null)}
                onConfirm={handleDeleteInvoice}
                title="Xóa hóa đơn?"
                message={<>Hóa đơn <strong>{deleteInvoice?.invoiceCode || `#${deleteInvoice?.invoiceId || ''}`}</strong> sẽ bị xóa. Chỉ có thể xóa hóa đơn chưa thanh toán, chưa có enrollment và không có payment attempt đang xử lý.</>}
                confirmText="Xóa hóa đơn"
                cancelText="Hủy"
                variant="danger"
                isLoading={deleteLoading}
            />
        </div>
    );
};
