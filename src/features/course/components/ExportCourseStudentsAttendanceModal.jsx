import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import { Button, Modal, Checkbox, Input, Dropdown } from '../../../shared/components/ui';
import { getDateRange } from '../../../shared/utils';
import { ATTENDANCE_STATUS_OPTIONS, TIME_RANGE_OPTIONS } from '../../../core/constants/options';
import {
    selectExportStudentsAttendanceOptions,
    setExportStudentsAttendanceOptions,
} from '../store/courseSlice';

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    ...ATTENDANCE_STATUS_OPTIONS,
];

const TIME_RANGE_OPTIONS_WITH_DEFAULT = [
    { value: '', label: 'Tùy chọn' },
    ...TIME_RANGE_OPTIONS,
];

export const ExportCourseStudentsAttendanceModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    initialFilters = {},
}) => {
    const dispatch = useDispatch();
    const exportOptions = useSelector(selectExportStudentsAttendanceOptions);

    const [timeRange, setTimeRange] = useState('');
    const [formData, setFormData] = useState({
        fromDate: initialFilters.fromDate || '',
        toDate: initialFilters.toDate || '',
        status: initialFilters.status || '',
    });

    const [errors, setErrors] = useState({});

    const handleTimeRangeChange = (value) => {
        setTimeRange(value);

        if (value) {
            const { fromDate: from, toDate: to } = getDateRange(value);
            setFormData((prev) => ({ ...prev, fromDate: from, toDate: to }));
            if (errors.fromDate || errors.toDate) {
                setErrors((prev) => ({ ...prev, fromDate: '', toDate: '' }));
            }
        } else {
            setFormData((prev) => ({ ...prev, fromDate: '', toDate: '' }));
        }
    };

    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        setTimeRange(''); // Reset preset when manual input
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleStatusChange = (value) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };

    const handleCheckboxChange = (field) => (checked) => {
        dispatch(setExportStudentsAttendanceOptions({ [field]: checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.fromDate) {
            newErrors.fromDate = 'Vui lòng chọn từ ngày';
        }
        if (!formData.toDate) {
            newErrors.toDate = 'Vui lòng chọn đến ngày';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onConfirm({
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            status: formData.status || undefined,
            options: exportOptions,
        });
    };

    const handleClose = () => {
        setTimeRange('');
        setFormData({
            fromDate: initialFilters.fromDate || '',
            toDate: initialFilters.toDate || '',
            status: initialFilters.status || '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="lg" title="Xuất Excel điểm danh học sinh">
            <form onSubmit={handleSubmit}>
                {/* Form Body */}
                <div className="space-y-6 mb-6">
                    {/* Date Range Section */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Khoảng thời gian <span className="text-error">*</span>
                        </label>
                        <div className="bg-background rounded-sm border border-border p-4">
                            <div className="space-y-3">
                                {/* Time Range Preset */}
                                <div>
                                    <Dropdown
                                        label="Chọn nhanh"
                                        options={TIME_RANGE_OPTIONS_WITH_DEFAULT}
                                        value={timeRange}
                                        onChange={handleTimeRangeChange}
                                    />
                                </div>

                                {/* Manual Date Inputs */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        type="date"
                                        label="Từ ngày"
                                        required
                                        value={formData.fromDate}
                                        onChange={handleInputChange('fromDate')}
                                        error={errors.fromDate}
                                    />
                                    <Input
                                        type="date"
                                        label="Đến ngày"
                                        required
                                        value={formData.toDate}
                                        onChange={handleInputChange('toDate')}
                                        error={errors.toDate}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <Dropdown
                            label="Lọc theo trạng thái"
                            options={STATUS_OPTIONS}
                            value={formData.status}
                            onChange={handleStatusChange}
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
                                        <strong>Các trường mặc định:</strong> STT, Mã học sinh, Họ, Tên,
                                        Tổng số buổi, Có mặt, Vắng, Muộn, Học bù (luôn được xuất)
                                    </p>
                                </div>

                                {/* Optional fields */}
                                <p className="text-xs font-medium text-foreground">Các trường tùy chọn:</p>

                                <div className="grid grid-cols-2 gap-3">
                                    <Checkbox
                                        id="includeSchool"
                                        label="Trường"
                                        checked={exportOptions.includeSchool}
                                        onChange={handleCheckboxChange('includeSchool')}
                                    />
                                    <Checkbox
                                        id="includeParentPhone"
                                        label="SĐT phụ huynh"
                                        checked={exportOptions.includeParentPhone}
                                        onChange={handleCheckboxChange('includeParentPhone')}
                                    />
                                    <Checkbox
                                        id="includeStudentPhone"
                                        label="SĐT học sinh"
                                        checked={exportOptions.includeStudentPhone}
                                        onChange={handleCheckboxChange('includeStudentPhone')}
                                    />
                                    <Checkbox
                                        id="includeGrade"
                                        label="Lớp"
                                        checked={exportOptions.includeGrade}
                                        onChange={handleCheckboxChange('includeGrade')}
                                    />
                                    <Checkbox
                                        id="includeEmail"
                                        label="Email"
                                        checked={exportOptions.includeEmail}
                                        onChange={handleCheckboxChange('includeEmail')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Lưu ý:</strong> File Excel sẽ chỉ chứa dữ liệu trong khoảng thời gian
                            và trạng thái bạn đã chọn. Các trường mặc định luôn được bao gồm.
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
