import { Button, Dropdown, Input, Textarea } from "../../../shared/components/ui";

const TYPE_OPTIONS = [
    { value: "BONUS", label: "Cộng điểm" },
    { value: "PENALTY", label: "Trừ điểm" },
];

export const StudentPointLogForm = ({
    mode = "create",
    formData,
    errors,
    loading,
    onChange,
    onTypeChange,
    onSubmit,
    onCancel,
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dropdown
                    label="Loại điểm"
                    value={formData.type}
                    options={TYPE_OPTIONS}
                    onChange={onTypeChange}
                    required
                    error={errors.type}
                />

                <Input
                    label="Số điểm"
                    name="points"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.points}
                    onChange={onChange}
                    required
                    error={errors.points}
                />
            </div>

            <Input
                label="Nguồn điểm"
                name="source"
                value={formData.source}
                onChange={onChange}
                placeholder="ADMIN_ADJUST"
                maxLength={50}
                required
                error={errors.source}
                helperText="VD: ADMIN_ADJUST, ATTENDANCE, COMPETITION_SUBMIT"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Loại tham chiếu"
                    name="referenceType"
                    value={formData.referenceType}
                    onChange={onChange}
                    placeholder="MANUAL"
                    maxLength={50}
                    error={errors.referenceType}
                />

                <Input
                    label="ID tham chiếu"
                    name="referenceId"
                    type="number"
                    min="1"
                    value={formData.referenceId}
                    onChange={onChange}
                    placeholder="VD: 123"
                    error={errors.referenceId}
                />
            </div>

            <Textarea
                label="Ghi chú"
                name="note"
                value={formData.note}
                onChange={onChange}
                placeholder="Nhập lý do cộng/trừ điểm..."
                maxLength={255}
                rows={4}
                error={errors.note}
            />

            <Textarea
                label="Metadata JSON"
                name="metadataText"
                value={formData.metadataText}
                onChange={onChange}
                placeholder='{"reason":"Học sinh có thành tích tốt"}'
                rows={5}
                maxLength={1200}
                error={errors.metadataText}
                helperText="Không bắt buộc. Nếu nhập, dữ liệu phải là JSON object hợp lệ."
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy
                </Button>
                <Button type="submit" loading={loading} disabled={loading}>
                    {mode === "create" ? "Tạo log điểm" : "Cập nhật"}
                </Button>
            </div>
        </form>
    );
};
