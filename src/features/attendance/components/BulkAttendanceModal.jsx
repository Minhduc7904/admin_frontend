import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button, Modal, Dropdown, Textarea } from '../../../shared/components/ui';
import { ClassSessionSearchSelect } from '../../classSesssion/components/ClassSessionSearchSelect';

/* ===================== STATUS OPTIONS ===================== */
const STATUS_OPTIONS = [
    { value: 'PRESENT', label: 'Có mặt' },
    { value: 'ABSENT', label: 'Vắng' },
    { value: 'LATE', label: 'Muộn' },
    { value: 'MAKEUP', label: 'Học bù' },
];

export const BulkAttendanceModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    classId,
    selectedSession: initialSession,
}) => {
    const [formData, setFormData] = useState({
        sessionId: initialSession?.sessionId || null,
        status: 'PRESENT',
        notes: '',
    });

    const [errors, setErrors] = useState({});

    const handleSessionSelect = (session) => {
        setFormData((prev) => ({ ...prev, sessionId: session?.sessionId || null }));
        if (errors.sessionId) {
            setErrors((prev) => ({ ...prev, sessionId: '' }));
        }
    };

    const handleStatusChange = (value) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };

    const handleNotesChange = (e) => {
        setFormData((prev) => ({ ...prev, notes: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.sessionId) {
            newErrors.sessionId = 'Vui lòng chọn buổi học';
        }
        if (!formData.status) {
            newErrors.status = 'Vui lòng chọn trạng thái';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onConfirm(formData);
    };

    const handleClose = () => {
        setFormData({
            sessionId: null,
            status: 'PRESENT',
            notes: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="lg">
            <div className="p-6">
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">
                            Điểm danh hàng loạt
                        </h3>
                        <p className="text-sm text-foreground-light">
                            Điểm danh cho tất cả học sinh trong lớp
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Form Body */}
                    <div className="space-y-6 mb-6">
                        {/* Session Select */}
                        <div>
                            <ClassSessionSearchSelect
                                label="Buổi học"
                                required
                                placeholder="Chọn buổi học cần điểm danh..."
                                onSelect={handleSessionSelect}
                                value={formData.sessionId}
                                error={errors.sessionId}
                                classId={classId}
                            />
                            <p className="text-xs text-foreground-light mt-1">
                                Chọn buổi học để điểm danh cho tất cả học sinh
                            </p>
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Trạng thái mặc định <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                value={formData.status}
                                onChange={handleStatusChange}
                                options={STATUS_OPTIONS}
                                placeholder="Chọn trạng thái"
                                error={errors.status}
                            />
                            <p className="text-xs text-foreground-light mt-1">
                                Trạng thái điểm danh sẽ áp dụng cho tất cả học sinh
                            </p>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Ghi chú chung
                            </label>
                            <Textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleNotesChange}
                                placeholder="Ghi chú áp dụng cho tất cả học sinh (nếu có)..."
                                rows={3}
                                maxLength={500}
                            />
                            <p className="text-xs text-foreground-light mt-1">
                                Ghi chú này sẽ được áp dụng cho tất cả bản ghi điểm danh
                            </p>
                        </div>

                        {/* Warning */}
                        <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Lưu ý:</strong> Hệ thống sẽ tự động tạo điểm danh cho tất cả học sinh
                                trong lớp. Các học sinh đã có điểm danh cho buổi này sẽ được bỏ qua.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading}
                        >
                            Điểm danh hàng loạt
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
