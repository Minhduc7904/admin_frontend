import { Edit2, Eye, Trash2 } from "lucide-react";
import { Table } from "../../../shared/components/ui";
import { formatDateTime, formatNumber } from "../../../shared/utils";

const TYPE_BADGE = {
    BONUS: "bg-green-100 text-green-700",
    PENALTY: "bg-red-100 text-red-700",
};

const TYPE_LABEL = {
    BONUS: "Cộng điểm",
    PENALTY: "Trừ điểm",
};

const getSignedPointText = (log) => {
    const signedPoint = Number(log.signedPoints ?? (log.type === "PENALTY" ? -log.points : log.points));
    if (Number.isNaN(signedPoint)) return "-";
    return `${signedPoint > 0 ? "+" : ""}${formatNumber(signedPoint)}`;
};

export const StudentPointLogTable = ({
    logs,
    loading,
    onView,
    onEdit,
    onDelete,
}) => {
    const columns = [
        {
            key: "pointLogId",
            label: "ID",
            render: (log) => (
                <span className="text-sm text-foreground-light">#{log.pointLogId}</span>
            ),
        },
        {
            key: "type",
            label: "Loại điểm",
            render: (log) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[log.type] || "bg-gray-100 text-gray-700"}`}>
                    {TYPE_LABEL[log.type] || log.type || "-"}
                </span>
            ),
        },
        {
            key: "points",
            label: "Điểm",
            align: "right",
            render: (log) => (
                <span className={`text-sm font-semibold ${Number(log.signedPoints) < 0 ? "text-red-600" : "text-green-600"}`}>
                    {getSignedPointText(log)}
                </span>
            ),
        },
        {
            key: "source",
            label: "Nguồn",
            render: (log) => (
                <div>
                    <p className="text-sm font-medium text-foreground">{log.source || "-"}</p>
                    {(log.referenceType || log.referenceId) && (
                        <p className="text-xs text-foreground-light">
                            {log.referenceType || "REF"}
                            {log.referenceId ? ` #${log.referenceId}` : ""}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "note",
            label: "Ghi chú",
            render: (log) => (
                <span className="text-sm text-foreground-light max-w-[280px] truncate block" title={log.note}>
                    {log.note || "-"}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Thời gian",
            render: (log) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Thao tác",
            align: "right",
            render: (log) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(log);
                        }}
                        className="p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} className="text-blue-600" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(log);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Cập nhật"
                    >
                        <Edit2 size={16} className="text-warning" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(log);
                        }}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={16} className="text-red-600" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={logs}
            loading={loading}
            emptyMessage="Chưa có log điểm nào"
            emptySubMessage="Các lần cộng/trừ điểm của học sinh sẽ hiển thị tại đây."
        />
    );
};
