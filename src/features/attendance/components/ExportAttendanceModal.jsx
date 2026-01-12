import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button, Modal, Checkbox } from '../../../shared/components/ui';
import { ClassSessionSearchSelect } from '../../classSesssion/components/ClassSessionSearchSelect';

export const ExportAttendanceModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    classId,
    selectedSession: initialSession,
}) => {
    const [formData, setFormData] = useState({
        sessionId: initialSession?.sessionId || null,
        // Export options with defaults matching backend
        includeSchool: true,
        includeParentPhone: true,
        includeStudentPhone: false,
        includeGrade: true,
        includeEmail: true,
        includeMarkedAt: true,
        includeNotes: true,
        includeMakeupNote: false,
        includeMarkerName: true,
    });

    const [errors, setErrors] = useState({});

    const handleSessionSelect = (session) => {
        setFormData((prev) => ({ ...prev, sessionId: session?.sessionId || null }));
        if (errors.sessionId) {
            setErrors((prev) => ({ ...prev, sessionId: '' }));
        }
    };

    const handleCheckboxChange = (field) => (checked) => {
        setFormData((prev) => ({ ...prev, [field]: checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.sessionId) {
            setErrors({ sessionId: 'Vui lòng chọn buổi học' });
            return;
        }

        // Prepare export options (exclude sessionId)
        const { sessionId, ...options } = formData;
        
        onConfirm({
            sessionId,
            options,
        });
    };

    const handleClose = () => {
        setFormData({
            sessionId: null,
            includeSchool: true,
            includeParentPhone: true,
            includeStudentPhone: false,
            includeGrade: true,
            includeEmail: true,
            includeMarkedAt: true,
            includeNotes: true,
            includeMakeupNote: false,
            includeMarkerName: true,
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="lg" title="Xuất Excel điểm danh">
            <form onSubmit={handleSubmit}>
                {/* Form Body */}
                <div className="space-y-6 mb-6">
                    {/* Session Select */}
                    <div>
                        <ClassSessionSearchSelect
                            label="Buổi học"
                            required
                            placeholder="Chọn buổi học cần xuất điểm danh..."
                            onSelect={handleSessionSelect}
                            value={formData.sessionId}
                            error={errors.sessionId}
                            classId={classId}
                        />
                    </div>

                    {/* Export Options */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Chọn các trường cần xuất
                        </label>
                        <div className="bg-background rounded-sm border border-border p-4">
                            <div className="space-y-3">
                                {/* Default fields info */}
                                <div className="pb-3 border-b border-border">
                                    <p className="text-xs text-foreground-light">
                                        <strong>Các trường mặc định:</strong> STT, Mã học sinh, Họ, Tên, Trạng thái
                                        (luôn được xuất)
                                    </p>
                                </div>

                                {/* Optional fields */}
                                <p className="text-xs font-medium text-foreground">Các trường tùy chọn:</p>

                                <div className="grid grid-cols-2 gap-3">
                                    <Checkbox
                                        id="includeSchool"
                                        label="Trường"
                                        checked={formData.includeSchool}
                                        onChange={handleCheckboxChange('includeSchool')}
                                    />
                                    <Checkbox
                                        id="includeParentPhone"
                                        label="SĐT phụ huynh"
                                        checked={formData.includeParentPhone}
                                        onChange={handleCheckboxChange('includeParentPhone')}
                                    />
                                    <Checkbox
                                        id="includeStudentPhone"
                                        label="SĐT học sinh"
                                        checked={formData.includeStudentPhone}
                                        onChange={handleCheckboxChange('includeStudentPhone')}
                                    />
                                    <Checkbox
                                        id="includeGrade"
                                        label="Lớp"
                                        checked={formData.includeGrade}
                                        onChange={handleCheckboxChange('includeGrade')}
                                    />
                                    <Checkbox
                                        id="includeEmail"
                                        label="Email"
                                        checked={formData.includeEmail}
                                        onChange={handleCheckboxChange('includeEmail')}
                                    />
                                    <Checkbox
                                        id="includeMarkedAt"
                                        label="Thời gian điểm danh"
                                        checked={formData.includeMarkedAt}
                                        onChange={handleCheckboxChange('includeMarkedAt')}
                                    />
                                    <Checkbox
                                        id="includeNotes"
                                        label="Ghi chú"
                                        checked={formData.includeNotes}
                                        onChange={handleCheckboxChange('includeNotes')}
                                    />
                                    <Checkbox
                                        id="includeMakeupNote"
                                        label="Ghi chú điểm danh bù"
                                        checked={formData.includeMakeupNote}
                                        onChange={handleCheckboxChange('includeMakeupNote')}
                                    />
                                    <Checkbox
                                        id="includeMarkerName"
                                        label="Người điểm danh"
                                        checked={formData.includeMarkerName}
                                        onChange={handleCheckboxChange('includeMarkerName')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Lưu ý:</strong> File Excel sẽ chỉ chứa các trường bạn đã chọn.
                            Các trường mặc định luôn được bao gồm.
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
                        <Download size={16} />
                        Xuất Excel
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
