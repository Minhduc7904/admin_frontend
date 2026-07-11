import { formatDateTime } from "../../../shared/utils";

const TYPE_LABEL = {
    BONUS: "Cộng điểm",
    PENALTY: "Trừ điểm",
};

const DetailRow = ({ label, value }) => (
    <div className="py-3 border-b border-border last:border-0">
        <p className="text-xs uppercase tracking-wide text-foreground-light mb-1">{label}</p>
        <div className="text-sm text-foreground break-words">{value === "" || value == null ? "-" : value}</div>
    </div>
);

export const StudentPointLogDetail = ({ log }) => {
    if (!log) {
        return (
            <div className="text-sm text-foreground-light">
                Chưa chọn log điểm.
            </div>
        );
    }

    const metadata = log.metadata
        ? JSON.stringify(log.metadata, null, 2)
        : "";

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground-light">Log điểm</p>
                        <h3 className="text-lg font-semibold text-foreground">#{log.pointLogId}</h3>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${log.type === "PENALTY" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {TYPE_LABEL[log.type] || log.type}
                    </span>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-white p-4">
                <DetailRow label="Điểm gốc" value={log.points} />
                <DetailRow label="Điểm có dấu" value={log.signedPoints} />
                <DetailRow label="Nguồn" value={log.source} />
                <DetailRow label="Loại tham chiếu" value={log.referenceType} />
                <DetailRow label="ID tham chiếu" value={log.referenceId} />
                <DetailRow label="Ghi chú" value={log.note} />
                <DetailRow label="Thời gian tạo" value={formatDateTime(log.createdAt)} />
            </div>

            <div className="rounded-lg border border-border bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-foreground-light mb-2">Metadata</p>
                {metadata ? (
                    <pre className="text-xs bg-gray-50 border border-border rounded-sm p-3 overflow-auto whitespace-pre-wrap">
                        {metadata}
                    </pre>
                ) : (
                    <p className="text-sm text-foreground-light">Không có metadata.</p>
                )}
            </div>
        </div>
    );
};
