import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Eye, Image as ImageIcon } from 'lucide-react';
import { Button, Dropdown, Checkbox, Slider } from '../../../shared/components/ui';
import { LoadingOverlay } from '../../../shared/components/loading/Loading';
import { exportAttendanceImageAsync, setExportOptions, selectAttendanceExportOptions } from '../store/attendanceSlice';
import { attendanceApi } from '../../../core/api';
import PDDExample from '../../../assets/PhieuDiemDanh_example.png'
import { useDebounce } from '../../../shared/hooks/useDebounce';
const FORMAT_OPTIONS = [
    { label: 'PNG (Chất lượng cao)', value: 'png' },
    { label: 'JPEG (Kích thước nhỏ)', value: 'jpeg' },
];

const WIDTH_OPTIONS = [
    { label: '800px (Nhỏ)', value: 800 },
    { label: '1200px (Trung bình)', value: 1200 },
    { label: '1600px (Lớn)', value: 1600 },
    { label: '2000px (Rất lớn)', value: 2000 },
];


export const AttendanceExport = ({ attendance }) => {
    const dispatch = useDispatch();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const options = useSelector(selectAttendanceExportOptions);
    const debouncedQuality = useDebounce(options.quality, 400);

    // Load preview whenever options change
    useEffect(() => {
        if (attendance?.attendanceId) {
            loadPreview();
        }
        // Cleanup previous preview URL
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [
        attendance?.attendanceId,
        options.format,
        options.width,
        options.includeCourseName,
        options.includeClassName,
        options.includeStartTime,
        options.includeEndTime,
        options.includePhoto,
        options.includeStudentId,
        options.includeEmail,
        options.includeParentPhone,
        options.includeStudentPhone,
        options.includeGradeSchool,
        options.includeMarkedAt,
        options.includeNotes,
        options.includeTuition,
        options.includeTeacherName,
        options.includeMarkerName,
        options.includeQRCode,
        debouncedQuality, // 🔥 chỉ debounce mỗi cái này
    ]);

    const loadPreview = async () => {
        if (!attendance?.attendanceId) return;

        setIsLoadingPreview(true);
        try {
            const response = await attendanceApi.exportImage(attendance.attendanceId, {
                ...options,
                mode: 'view',
            });

            const blob = response.data || response;
            const url = URL.createObjectURL(blob);

            // Revoke previous URL if exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(url);
        } catch (error) {
            console.error('Error loading preview:', error);
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleOptionChange = (key, value) => {
        dispatch(setExportOptions({ [key]: value }));
    };

    const handleDownload = () => {
        dispatch(exportAttendanceImageAsync({
            id: attendance.attendanceId,
            options: { ...options, mode: 'download' },
        }));
    };

    const handleViewInNewTab = () => {
        dispatch(exportAttendanceImageAsync({
            id: attendance.attendanceId,
            options: { ...options, mode: 'view' },
        }));
    };

    if (!attendance) {
        return (
            <div className="p-6 text-center text-foreground-light">
                Không có dữ liệu điểm danh
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                {/* ===== OPTIONS SECTION ===== */}
                <div className="px-6 py-4 border-b border-border bg-primary-light">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Tùy chọn xuất phiếu
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Format */}
                        <Dropdown
                            label="Định dạng ảnh"
                            value={options.format}
                            options={FORMAT_OPTIONS}
                            onChange={(value) => handleOptionChange('format', value)}
                        />

                        {/* Quality */}
                        {options.format === 'jpeg' && (
                            <Slider
                                label="Chất lượng"
                                value={options.quality}
                                min={50}
                                max={100}
                                onChange={(v) => handleOptionChange('quality', v)}
                            />
                        )}


                        {/* Width */}
                        <Dropdown
                            label="Độ rộng (px)"
                            value={options.width}
                            options={WIDTH_OPTIONS}
                            onChange={(value) => handleOptionChange('width', value)}
                        />

                    </div>

                    {/* Checkboxes */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">

                        <Checkbox
                            checked={options.includeCourseName}
                            onChange={(v) => handleOptionChange('includeCourseName', v)}
                            label="Tên khóa học"
                        />

                        <Checkbox
                            checked={options.includeClassName}
                            onChange={(v) => handleOptionChange('includeClassName', v)}
                            label="Tên lớp"
                        />

                        <Checkbox
                            checked={options.includeStartTime}
                            onChange={(v) => handleOptionChange('includeStartTime', v)}
                            label="Giờ bắt đầu"
                        />

                        <Checkbox
                            checked={options.includeEndTime}
                            onChange={(v) => handleOptionChange('includeEndTime', v)}
                            label="Giờ kết thúc"
                        />

                        <Checkbox
                            checked={options.includePhoto}
                            onChange={(v) => handleOptionChange('includePhoto', v)}
                            label="Ảnh học sinh"
                        />

                        <Checkbox
                            checked={options.includeStudentId}
                            onChange={(v) => handleOptionChange('includeStudentId', v)}
                            label="Mã học sinh"
                        />

                        <Checkbox
                            checked={options.includeEmail}
                            onChange={(v) => handleOptionChange('includeEmail', v)}
                            label="Email"
                        />

                        <Checkbox
                            checked={options.includeParentPhone}
                            onChange={(v) => handleOptionChange('includeParentPhone', v)}
                            label="SĐT phụ huynh"
                        />

                        <Checkbox
                            checked={options.includeStudentPhone}
                            onChange={(v) => handleOptionChange('includeStudentPhone', v)}
                            label="SĐT học sinh"
                        />

                        <Checkbox
                            checked={options.includeGradeSchool}
                            onChange={(v) => handleOptionChange('includeGradeSchool', v)}
                            label="Khối & Trường"
                        />

                        <Checkbox
                            checked={options.includeMarkedAt}
                            onChange={(v) => handleOptionChange('includeMarkedAt', v)}
                            label="Thời gian đến lớp"
                        />

                        <Checkbox
                            checked={options.includeNotes}
                            onChange={(v) => handleOptionChange('includeNotes', v)}
                            label="Ghi chú & Nhận xét"
                        />

                        <Checkbox
                            checked={options.includeTuition}
                            onChange={(v) => handleOptionChange('includeTuition', v)}
                            label="Thông tin học phí"
                        />

                        <Checkbox
                            checked={options.includeTeacherName}
                            onChange={(v) => handleOptionChange('includeTeacherName', v)}
                            label="Giáo viên giảng dạy"
                        />

                        <Checkbox
                            checked={options.includeMarkerName}
                            onChange={(v) => handleOptionChange('includeMarkerName', v)}
                            label="Người điểm danh"
                        />

                        <Checkbox
                            checked={options.includeQRCode}
                            onChange={(v) => handleOptionChange('includeQRCode', v)}
                            label="QR Code"
                        />
                    </div>


                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleDownload}
                            icon={Download}
                        >
                            Tải xuống
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleViewInNewTab}
                            icon={Eye}
                        >
                            Xem tab mới
                        </Button>
                    </div>
                </div>

                {/* ===== PREVIEW SECTION ===== */}
                <div className="px-6 py-4 relative">
                    <h3 className="font-semibold text-foreground mb-4">
                        Xem trước phiếu điểm danh
                    </h3>

                    <div className="relative bg-gray-50 rounded-sm border border-border overflow-hidden min-h-[600px] flex items-center justify-center">

                        {/* Ảnh example nền (luôn luôn có) */}


                        {/* Ảnh preview thật */}
                        {previewUrl && !isLoadingPreview && (
                            <img
                                src={previewUrl}
                                alt="Preview phiếu điểm danh"
                                className="relative w-full h-auto z-10"
                            />
                        )}

                        {/* Overlay loading */}
                        {isLoadingPreview && (
                            <>
                                <img
                                    src={PDDExample}
                                    alt="Phiếu điểm danh mẫu"
                                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300`}
                                />
                                <LoadingOverlay message="Đang tải xem trước..." />
                            </>
                        )}

                        {/* Fallback khi không có preview */}
                        {!isLoadingPreview && !previewUrl && (
                            <p className="relative z-10 text-foreground-light">
                                Không thể tải xem trước
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
